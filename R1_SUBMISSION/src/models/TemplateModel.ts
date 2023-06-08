export default class TemplateModel {
    id: string;
    label: string;
    value: string;
    script: Record<string, string>;

    constructor(
        label: string,
        id: string,
        value: string,
        script: Record<string, string>
    ) {
        this.label = label;
        this.id = id;
        this.value = value;
        this.script = script;
    }
}