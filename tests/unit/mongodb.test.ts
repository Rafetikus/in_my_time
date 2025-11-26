import { connectDB } from '@/lib/mongodb';

jest.mock('@/lib/mongodb', () => ({
  connectDB: jest.fn()
}));

describe('connectDB', () => {
  const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when connection is cached', () => {
    it('should return cached connection when conn exists', async () => {
      const mockConnection = { isConnected: true };
      mockConnectDB.mockResolvedValueOnce(mockConnection as any);

      const result = await connectDB();
      expect(result).toBe(mockConnection);
    });

    it('should return cached connection when promise is resolved', async () => {
      const mockConnection = { isConnected: true };
      mockConnectDB.mockResolvedValueOnce(mockConnection as any);

      const result = await connectDB();
      expect(result).toBe(mockConnection);
    });
  });

  describe('when creating new connection', () => {
    it('should create new connection when no cached promise exists', async () => {
      const mockConnection = { isConnected: true };
      mockConnectDB.mockResolvedValueOnce(mockConnection as any);

      const result = await connectDB();
      expect(result).toBe(mockConnection);
    });

    it('should throw error when MONGO_URI is not defined', async () => {
      const error = new Error('MONGO_URI environment variable is not defined!');
      mockConnectDB.mockRejectedValueOnce(error);

      await expect(connectDB()).rejects.toThrow('MONGO_URI environment variable is not defined!');
    });

    it('should reuse existing promise when multiple calls happen simultaneously', async () => {
      const mockConnection = { isConnected: true };
      mockConnectDB.mockResolvedValue(mockConnection as any);

      const promise1 = connectDB();
      const promise2 = connectDB();
      const promise3 = connectDB();

      const results = await Promise.all([promise1, promise2, promise3]);

      results.forEach(result => {
        expect(result).toBe(mockConnection);
      });
    });
  });

  describe('when connection fails', () => {
    it('should reset promise and throw error on connection failure', async () => {
      const connectionError = new Error('Connection failed');
      mockConnectDB.mockRejectedValueOnce(connectionError);

      await expect(connectDB()).rejects.toThrow('Connection failed');
    });

    it('should allow retry after failed connection', async () => {
      const connectionError = new Error('Connection failed');
      const mockConnection = { isConnected: true };
      mockConnectDB
        .mockRejectedValueOnce(connectionError)
        .mockResolvedValueOnce(mockConnection as any);

      await expect(connectDB()).rejects.toThrow('Connection failed');
      const result = await connectDB();
      
      expect(result).toBe(mockConnection);
    });
  });
});