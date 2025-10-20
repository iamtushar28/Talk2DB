import React from 'react'

const MongoDBConnection = () => {

    return (
        <form className="w-full mt-4 flex flex-col gap-4">

            {/* db name */}
            <div>
                <label htmlFor="dbName" className='font-semibold'>Name</label>
                <input
                    type="text"
                    id='dbName'
                    placeholder='Database Name e.g. Acme DB'
                    className="w-full h-12 mt-2 p-3 border border-zinc-300 rounded-lg outline-none hover:ring-2 ring-violet-500 transition-all duration-300"
                />
            </div>

            {/* connection url */}
            <div>
                <label htmlFor="connectionURL" className='font-semibold'>Connection URL</label>
                <textarea
                    name="connectionURL"
                    id="connectionURL"
                    placeholder='Connection URL e.g. mongodb://username:password@host:port/database?authSource=admin'
                    className="w-full h-24 mt-2 p-3 border border-zinc-300 rounded-lg outline-none hover:ring-2 ring-violet-500 transition-all duration-300"
                >
                </textarea>
            </div>

            <div className='w-full flex justify-end'>
                <button
                    type="submit"
                    className="mt-2 py-2 px-4 w-fit bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-all duration-300 cursor-pointer"
                >
                    Connect
                </button>
            </div>
        </form>
    )
}

export default MongoDBConnection