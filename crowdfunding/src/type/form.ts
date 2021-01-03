export declare interface Form {
    canSubmit?: boolean,
    submitHint?: string,
    cancelHint?: string,
    finish?: () => void,
    cancel?: () => void,
    layout?: string,
}

export declare interface Model {
    [property: string]: any
}

export declare interface Field {
    type?: 'input' | 'textarea' | 'number' | 'upload' | 'autocomplete' | 'radio' | 'password' | 'time' | 'avatar' | 'search' | 'select',
    label: string,
    disabled?: boolean,
    min?: number,
    max?: number,
    radios?: Array<{ value: number, hint: string }>,
    file?: {
        multiple?: boolean,
        name?: string,
        action?: string,
        beforeUpload?: () => boolean,
        onChange?: (info) => void,
        data?: () => Object
    },
    search?: {
        placeholder: string,
        role: Role
    },
    autoComplete?: {
        handleSearch: (data, now: string) => void
    },
    rule?: {
        required?: boolean,
        message?: string,
        validator?: (rule, value) => Promise<string> | Promise<null>,
        trigger: 'blur' | 'change'
    },
    customRender?: {
        slot: string
    },
    select?: string[]
}


export declare interface Fields {
    [property: string]: Field
}