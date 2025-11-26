import { generateAvailableSlots } from '@/lib/slot-generator';
import { addMinutes, setHours, setMinutes } from 'date-fns';
import { IPoll } from '@/types/Poll';

jest.mock('date-fns', () => ({
  addMinutes: jest.fn(),
  setHours: jest.fn(),
  setMinutes: jest.fn(),
}));

describe('generateAvailableSlots', () => {
  const mockSetMinutes = setMinutes as jest.MockedFunction<typeof setMinutes>;
  const mockSetHours = setHours as jest.MockedFunction<typeof setHours>;
  const mockAddMinutes = addMinutes as jest.MockedFunction<typeof addMinutes>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('single day with multiple slots', () => {
    it('should generate correct slots for a single day', () => {
      const targetDate = new Date('2024-01-01');
      const config: IPoll['config'] = {
        targetDates: [targetDate],
        dailyStartTime: '09:00',
        dailyEndTime: '12:00',
        slotDuration: 60
      };

      const mockStartTime = new Date('2024-01-01T09:00:00');
      const mockEndTime = new Date('2024-01-01T12:00:00');
      const mockSlot1 = new Date('2024-01-01T09:00:00');
      const mockSlot2 = new Date('2024-01-01T10:00:00');
      const mockSlot3 = new Date('2024-01-01T11:00:00');

      mockSetHours
        .mockReturnValueOnce(targetDate)
        .mockReturnValueOnce(targetDate);

      mockSetMinutes
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      mockAddMinutes
        .mockReturnValueOnce(mockSlot2)
        .mockReturnValueOnce(mockSlot3)
        .mockReturnValueOnce(new Date('2024-01-01T12:00:00'));

      const result = generateAvailableSlots(config);

      expect(result).toEqual([mockSlot1, mockSlot2, mockSlot3]);
      expect(mockSetHours).toHaveBeenCalledWith(targetDate, 9);
      expect(mockSetHours).toHaveBeenCalledWith(targetDate, 12);
      expect(mockSetMinutes).toHaveBeenCalledWith(targetDate, 0);
      expect(mockSetMinutes).toHaveBeenCalledWith(targetDate, 0);
      expect(mockAddMinutes).toHaveBeenCalledWith(mockSlot1, 60);
      expect(mockAddMinutes).toHaveBeenCalledWith(mockSlot2, 60);
    });
  });

describe('multiple days', () => {
  it('should generate slots for multiple target dates', () => {
    // Arrange
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');
    const config: IPoll['config'] = {
      targetDates: [date1, date2],
      dailyStartTime: '10:00',
      dailyEndTime: '11:00',
      slotDuration: 30
    };

    const mockDate1Start = new Date('2024-01-01T10:00:00');
    const mockDate1End = new Date('2024-01-01T11:00:00');
    const mockDate1Slot1 = new Date('2024-01-01T10:00:00');
    const mockDate1Slot2 = new Date('2024-01-01T10:30:00');
    
    const mockDate2Start = new Date('2024-01-02T10:00:00');
    const mockDate2End = new Date('2024-01-02T11:00:00');
    const mockDate2Slot1 = new Date('2024-01-02T10:00:00');
    const mockDate2Slot2 = new Date('2024-01-02T10:30:00');

    mockSetHours
      .mockReturnValueOnce(date1)
      .mockReturnValueOnce(date1)
      .mockReturnValueOnce(date2)
      .mockReturnValueOnce(date2);

    mockSetMinutes
      .mockReturnValueOnce(mockDate1Start)
      .mockReturnValueOnce(mockDate1End)
      .mockReturnValueOnce(mockDate2Start)
      .mockReturnValueOnce(mockDate2End);

    mockAddMinutes
      .mockReturnValueOnce(mockDate1Slot2)
      .mockReturnValueOnce(new Date('2024-01-01T11:00:00'))
      .mockReturnValueOnce(mockDate2Slot2)
      .mockReturnValueOnce(new Date('2024-01-02T11:00:00'));

    const result = generateAvailableSlots(config);

    expect(result).toEqual([mockDate1Slot1, mockDate1Slot2, mockDate2Slot1, mockDate2Slot2]);
    expect(mockSetHours).toHaveBeenCalledTimes(4);
    expect(mockAddMinutes).toHaveBeenCalledTimes(4);
  });
});

  describe('edge cases', () => {
    it('should handle exact time boundaries correctly', () => {
      const targetDate = new Date('2024-01-01');
      const config: IPoll['config'] = {
        targetDates: [targetDate],
        dailyStartTime: '09:00',
        dailyEndTime: '10:00',
        slotDuration: 60
      };

      const mockStartTime = new Date('2024-01-01T09:00:00');
      const mockEndTime = new Date('2024-01-01T10:00:00');

      mockSetHours
        .mockReturnValueOnce(targetDate)
        .mockReturnValueOnce(targetDate);

      mockSetMinutes
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      mockAddMinutes
        .mockReturnValueOnce(new Date('2024-01-01T10:00:00'));

      const result = generateAvailableSlots(config);

      expect(result).toEqual([mockStartTime]);
    });

    it('should return empty array when no time available', () => {
      const targetDate = new Date('2024-01-01');
      const config: IPoll['config'] = {
        targetDates: [targetDate],
        dailyStartTime: '09:00',
        dailyEndTime: '09:00',
        slotDuration: 60
      };

      const mockStartTime = new Date('2024-01-01T09:00:00');
      const mockEndTime = new Date('2024-01-01T09:00:00');

      mockSetHours
        .mockReturnValueOnce(targetDate)
        .mockReturnValueOnce(targetDate);

      mockSetMinutes
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      const result = generateAvailableSlots(config);

      expect(result).toEqual([]);
      expect(mockAddMinutes).not.toHaveBeenCalled();
    });

    it('should handle slot duration that does not fit evenly', () => {
      const targetDate = new Date('2024-01-01');
      const config: IPoll['config'] = {
        targetDates: [targetDate],
        dailyStartTime: '09:00',
        dailyEndTime: '10:20',
        slotDuration: 30
      };

      const mockStartTime = new Date('2024-01-01T09:00:00');
      const mockEndTime = new Date('2024-01-01T10:20:00');
      const mockSlot1 = new Date('2024-01-01T09:00:00');
      const mockSlot2 = new Date('2024-01-01T09:30:00');
      const mockSlot3 = new Date('2024-01-01T10:00:00');

      mockSetHours
        .mockReturnValueOnce(targetDate)
        .mockReturnValueOnce(targetDate);

      mockSetMinutes
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      mockAddMinutes
        .mockReturnValueOnce(mockSlot2)
        .mockReturnValueOnce(mockSlot3)
        .mockReturnValueOnce(new Date('2024-01-01T10:30:00'));

      const result = generateAvailableSlots(config);

      expect(result).toEqual([mockSlot1, mockSlot2, mockSlot3]);
    });
  });

  describe('time parsing', () => {
    it('should correctly parse time strings with minutes', () => {
      const targetDate = new Date('2024-01-01');
      const config: IPoll['config'] = {
        targetDates: [targetDate],
        dailyStartTime: '09:30',
        dailyEndTime: '11:45',
        slotDuration: 45
      };

      const mockStartTime = new Date('2024-01-01T09:30:00');
      const mockEndTime = new Date('2024-01-01T11:45:00');

      mockSetHours
        .mockReturnValueOnce(targetDate)
        .mockReturnValueOnce(targetDate);

      mockSetMinutes
        .mockReturnValueOnce(mockStartTime)
        .mockReturnValueOnce(mockEndTime);

      mockAddMinutes
        .mockReturnValueOnce(new Date('2024-01-01T10:15:00'))
        .mockReturnValueOnce(new Date('2024-01-01T11:00:00'))
        .mockReturnValueOnce(new Date('2024-01-01T11:45:00'))
        .mockReturnValueOnce(new Date('2024-01-01T12:30:00'));

      const result = generateAvailableSlots(config);

      expect(result).toHaveLength(3);
      expect(mockSetHours).toHaveBeenCalledWith(targetDate, 9);
      expect(mockSetHours).toHaveBeenCalledWith(targetDate, 11);
      expect(mockSetMinutes).toHaveBeenCalledWith(targetDate, 30);
      expect(mockSetMinutes).toHaveBeenCalledWith(targetDate, 45);
    });
  });
});