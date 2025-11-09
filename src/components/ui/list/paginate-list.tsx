// pages/list.tsx
import React from 'react';

type Item = {
    id: string;
    title: string;
    description?: string;
}

const items: Item[] = [
    { id: '1', title: 'Lorem ipsum dolor sit amet', description: 'It is a long established fact reader' },
    { id: '2', title: 'Lorem ipsum dolor sit amet' },
    { id: '3', title: 'Lorem ipsum dolor sit amet' },
    // more items...
];

const ListPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">List</h1>

            <section className="mb-8">
                <h2 className="text-xl font-medium mb-2">Unordered List</h2>
                <ul className="list-disc pl-5 space-y-1">
                    {items.map(item => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-medium mb-2">Ordered List</h2>
                <ol className="list-decimal pl-5 space-y-1">
                    {items.map(item => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-medium mb-2">List with Buttons</h2>
                <ul className="space-y-2">
                    {['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam'].map(label => (
                        <li key={label}>
                            <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-medium mb-2">List with Checkbox</h2>
                <ul className="space-y-2">
                    {items.map(item => (
                        <li key={item.id} className="flex items-center">
                            <input type="checkbox" id={`chk-${item.id}`} className="mr-2" />
                            <label htmlFor={`chk-${item.id}`}>{item.title}</label>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-medium mb-2">Horizontal List</h2>
                <ul className="flex space-x-4">
                    {items.map(item => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </section>

        </div>
    );
};

export default ListPage;
