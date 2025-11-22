import { PollContent } from '../../components/poll/PollContent';
import { getPollData } from '@/lib/data-fetcher';



interface PollPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PollPage({ params }: PollPageProps) {
    const parameters =  await params;
    const pollId = parameters.id;

    let pollData;
    try {
        pollData = await getPollData(pollId);
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return <div className="text-center p-20 text-red-500">Server error occurred while fetching data.</div>;
    }

    return (
        <PollContent pollData={pollData} pollId={pollId} />
    );
}