import { useEffect, useState } from "react"

const CustomDropDown = ({label, name, options, value, onChange, allowCustomInput=true}) => {
    const [showOptions, setShowOptions] = useState(false)
    const [inputValue, setInputValue] = useState(value || '')
    useEffect(()=>{
        if(!allowCustomInput){
            setInputValue(value || '');
        }
    }, [value, allowCustomInput]);

    const handleInputChange = (e) => {
        if(!allowCustomInput) return;
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
    };

    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option);
        setShowOptions(false);
    }
    const filteredOptions = allowCustomInput
    ? options.filter(opt=>opt.toLowerCase().includes(inputValue.toLowerCase())):options;

    return(
        <div style={{position: 'relative', marginBottom: '1rem'}}>
            <label style={{display:'block', marginBottom: '0.3rem', color: 'white'}}>
                {label}
            </label>
            <input
                type="text"
                value={inputValue}
                readOnly={!allowCustomInput}
                onChange={handleInputChange}
                onClick={() => setShowOptions(true)}
                onBlur={() => setTimeout(()=>setShowOptions(false), 150)}
                placeholder={`Select${allowCustomInput ? ' or type': ''} an option`}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginLeft: '2rem',
                    marginBottom: 0,
                    borderRadius: '8px',
                    border: '1px solid gray',
                    fontSize: '16px',
                    backgroundColor: '#BDC1C3',
                    cursor: allowCustomInput ? 'text' : 'pointer',
                    color: '#173D62'
                }}
            />
            {showOptions && filteredOptions.length > 0 && (
                <ul
                style={{
                    position: 'absolute',
                    zIndex: '999',
                    backgroundColor: 'white',
                    listStyle: 'none',
                    padding: 0,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    width: '100%',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    marginLeft:'2rem'
                }}
                >
                    {filteredOptions.map((option, idx)=>(
                        <li
                        key={idx}
                        onMouseDown={()=>handleOptionClick(option)}
                        style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                        }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CustomDropDown