import React from 'react';

const ConnectionFormField = ({ id, label, type = 'text', placeholder, register, errorMessage, isTextarea = false }) => {
    const InputComponent = isTextarea ? 'textarea' : 'input';
    const baseClasses = `w-full mt-2 p-3 border rounded-xl outline-none ring-violet-500`;
    const errorClass = errorMessage ? 'border-red-500' : 'border-zinc-300 hover:ring-2';
    const heightClass = isTextarea ? 'h-28' : 'h-12';

    return (
        <div>
            <label htmlFor={id} className='font-semibold'>{label}</label>
            <InputComponent
                id={id}
                type={type}
                placeholder={placeholder}
                {...register} // Spread the object returned by useForm's register
                className={`${baseClasses} ${errorClass} ${heightClass}`}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};

export default ConnectionFormField;