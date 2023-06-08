import {InputField, InputMeta, InputView} from "../../../DropDownPicker/InputStyles";
import React, {useState} from "react";

type SilencePickerProps = {
    selectedSilenceDuration: number,
    defaultSilenceDuration: number,
    onSilenceDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export const SilencePicker = (
    {selectedSilenceDuration, defaultSilenceDuration, onSilenceDurationChange}: SilencePickerProps
) => {
    const [value, setValue] = useState(selectedSilenceDuration)

    return <InputView>
        {"Silence Duration"}
        <InputField
            value={value}
            placeholder={"Set Silence Duration"}
            onChange={(event) => {
                setValue(parseFloat(event.target.value) || 0)
                onSilenceDurationChange(event)
            }}
        />
        <InputMeta>
            {"Template Default: " + defaultSilenceDuration}
        </InputMeta>
    </InputView>
}