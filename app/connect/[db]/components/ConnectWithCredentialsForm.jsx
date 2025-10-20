import React from 'react'

const ConnectWithCredentialsForm = () => {
    // define all input fields here
    const inputFields = [
        {
            id: 'dbName',
            label: 'Name',
            placeholder: 'Database Name e.g. Acme DB',
            type: 'text',
        },
        {
            id: 'host',
            label: 'Host',
            placeholder: 'Hostname or IP e.g. localhost',
            type: 'text',
        },
        {
            id: 'database',
            label: 'Database',
            placeholder: 'Database name e.g. my_database',
            type: 'text',
        },
        {
            id: 'user',
            label: 'User',
            placeholder: 'Username e.g. admin',
            type: 'text',
        },
        {
            id: 'password',
            label: 'Password',
            placeholder: 'Your database password',
            type: 'password',
        },
        {
            id: 'port',
            label: 'Port',
            placeholder: 'Default port e.g. 3306',
            type: 'number',
        },
    ];

    return (
        <form className="w-full mt-4 flex flex-col gap-4">
            {inputFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                    <label htmlFor={field.id} className="font-semibold">
                        {field.label}
                    </label>
                    <input
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        className="w-full h-12 px-3 border border-zinc-300 rounded-lg outline-none hover:ring-2 ring-violet-500 transition-all duration-300"
                    />
                </div>
            ))}

            <div className='w-full flex justify-end'>
                <button
                    type="submit"
                    className="mt-2 py-2 px-4 w-fit bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-all duration-300 cursor-pointer"
                >
                    Connect
                </button>
            </div>
        </form>
    );
};

export default ConnectWithCredentialsForm;
