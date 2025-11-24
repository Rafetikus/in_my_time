import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Poll } from '@/models/Poll';
import { generateAvailableSlots } from '@/lib/slot-generator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("2. Incoming Data (Body):", body);

        await connectDB();
        console.log("3. MongoDB connection successful.");

        const { title, description, ownerId, config } = body;

        if (!title || !ownerId || !config) {
            return NextResponse.json(
                { message: 'Title, owner ID, and config are required.' },
                { status: 400 }
            );
        }

        // convert targetDates (strings) → Date objects
        const normalizedConfig = {
            ...config,
            targetDates: (config.targetDates || []).map(
                (d: string) => new Date(d)
            ),
        };

        const availableDates = generateAvailableSlots(normalizedConfig);

        const newPoll = await Poll.create({
            title,
            description: description || '',
            ownerId,
            config: normalizedConfig,
            availableDates,
        });

        console.log("4. Data saved successfully.");

        return NextResponse.json(
            {
                message: 'Poll created successfully.',
                pollId: newPoll._id,
                shareUrl: `/poll/${newPoll._id}`
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("CRITICAL SERVER ERROR:", error);
        return NextResponse.json(
            { message: 'Server error: Could not create poll.', detail: (error as Error).message },
            { status: 500 }
        );
    }
}
