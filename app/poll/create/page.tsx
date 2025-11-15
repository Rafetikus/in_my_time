"use client"

import { useState } from 'react';
import { PlusCircle, Trash2, Calendar, Send } from 'lucide-react';

interface DateSlot {
    id: number;
    time: string;
}

export default function CreatePollPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
    const [newDateValue, setNewDateValue] = useState('');

    const handleAddDate = () => {
        if (newDateValue.trim() && !dateSlots.some(slot => slot.time === newDateValue)) {
            const newSlot: DateSlot = {
                id: Date.now(),
                time: newDateValue
            };
            setDateSlots([...dateSlots, newSlot]);
            setNewDateValue('');
        }
    };

    const handleRemoveDate = (id: number) => {
        setDateSlots(dateSlots.filter(slot => slot.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || dateSlots.length === 0) {
            alert("Title and at least one date/time option are required!");
            return;
        }

        console.log("Data to be sent:", {
            title,
            description,
            availableDates: dateSlots.map(d => d.time)
        });

        // API POST request logic goes here
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">

                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Calendar className="w-7 h-7 text-indigo-600"/>
                            Create New Poll
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Set the event details and available time slots for participants.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Example: Weekly Team Meeting"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Describe the purpose of the meeting (optional)."
                            />
                        </div>

                        <div>
                            <h2 className="text-md font-semibold text-gray-700 mb-3">
                                Suggested Time Slots ({dateSlots.length}) <span className="text-red-500">*</span>
                            </h2>

                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={newDateValue}
                                    onChange={(e) => setNewDateValue(e.target.value)}
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddDate}
                                    className="flex items-center gap-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                                >
                                    <PlusCircle className="w-5 h-5"/> Add
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                {dateSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-indigo-700">
                                            {new Date(slot.time).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDate(slot.id)}
                                            className="text-red-500 hover:text-red-700 transition duration-150"
                                            aria-label="Remove"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!title || dateSlots.length === 0}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5"/> Create Poll
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </main>
    );
}