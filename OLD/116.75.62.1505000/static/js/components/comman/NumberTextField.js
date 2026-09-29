// components/NumberTextField.jsx
import {
    TextField
} from "@mui/material";
const NumberTextField = ({
    onChange,
    ...props
}) => {
    const handleKeyDown = (e) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    };
    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            onChange(e);
        }
    };
    return ( <
        TextField { ...props
        }
        type = "number"
        onKeyDown = {
            handleKeyDown
        }
        onChange = {
            handleNumberChange
        }
        inputProps = {
            {
                min: 0,
                ...props.inputProps
            }
        }
        />
    );
};
export default NumberTextField;