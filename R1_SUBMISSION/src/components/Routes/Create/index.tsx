import { Page, Section, SectionContent, SnippetText } from "./CreateStyles";
import CreateTopBar from "./Topbar";
import { TemplatePicker } from "./component/TemplatePicker";
import React, { useEffect, useState } from "react";
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from "../../../integrations/credentials";
import { AirtableTablesAndViews } from "../../../integrations/airtable.tables.views";
import Airtable from "airtable";
import { asSilenceFloatOr0, groupBy, parseAsJsonObject } from "../../../utils/helpers";
import SnippetGroupPicker from "./component/SnippetGroupPicker";
import Crunker from "crunker";
import LoadingSpinner from "../../Loading/loading";
import TemplateModel from "../../../models/TemplateModel";
import { SnippetGroup } from "../../../models/SnippetGroup";
import MyLogger from "../../../integrations/myLogger";
import { SilencePicker } from "./component/SilencePicker";
import { BlackButton2 } from "./CreateTemplate/CreateTemplateStyle";
import ShuffleIcon from '@mui/icons-material/Shuffle';

function CreatePage() {

    let crunker = new Crunker();
    let base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    const [availableTemplates, setAvailableTemplates] = useState<TemplateModel[]>([]);
    const [selectedTemplateValue, setSelectedTemplateValue] = useState<string>('No Template Selected');
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    const [availableSnippetGroups, setAvailableSnippetGroups] = useState<Record<string, SnippetGroup[]>>({});

    const [isLoading, setIsLoading] = useState(false)

    const onTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateValue = event.target.value
        setSelectedTemplateValue(selectedTemplateValue);
    }

    const loadSnippetGroups = async () => {
        let table = base(AirtableTablesAndViews.SnippetGroups.TABLE_ID);
        let firstPage = await table.select({
            view: AirtableTablesAndViews.SnippetGroups.VIEW_ID,
        }).firstPage()
        let results: object = firstPage.map(record => {
            record.fields["label"] = record.fields["Snippet Name"];
            record.fields["value"] = record.fields["Snippet Name"];
            return record.fields
        });
        // @ts-ignore
        results = groupBy(results, item => item["Type of Snippet"]);
        setAvailableSnippetGroups(parseAsJsonObject(results));
    }
    // console.log(availableTemplates);
    const loadTemplatesAndSnippets = async () => {
        let table = base(AirtableTablesAndViews.Templates.TABLE_ID);
        let firstPage = await table.select({ view: AirtableTablesAndViews.Templates.VIEW_ID }).firstPage()
        let templates = firstPage.map((record) => {
            return {
                label: record.get("templateDisplayName"),
                id: record.get("TemplateID"),
                value: record.get("TemplateID"),
                script: JSON.parse((record.get("templateStructure") ?? "{}") as string)
            } as TemplateModel
        })
        setAvailableTemplates(templates)
        setSelectedTemplateValue(templates[0].value)
        loadSnippetGroups()
    }

    useEffect(() => {
        loadTemplatesAndSnippets()
    }, [])

    useEffect(() => {
        let selectedVariants: Record<string, string> = {}
        for (const [snippetPos, snippetName] of Object.entries(getSelectedTemplate()?.script ?? {})) {
            MyLogger.info("snippet", snippetName)
            if (availableSnippetGroups[snippetName]) {
                MyLogger.info(` matched snippet at ${snippetPos} ->`, availableSnippetGroups[snippetName][0].value)
                selectedVariants[snippetPos] = availableSnippetGroups[snippetName][0].value
            } else if (snippetName.toLocaleString().includes("silence")) {
                MyLogger.info(` matched silence at ${snippetPos} ->`, snippetName)
                selectedVariants[snippetPos] = snippetName
            }
        }
        setSelectedVariants(selectedVariants)
        MyLogger.info("selectedVariants", selectedVariants)
    }, [availableSnippetGroups, selectedTemplateValue])

    function getSelectedTemplate(selectedTempValue: string = selectedTemplateValue): TemplateModel {
        return availableTemplates.find((temp) => temp.value === selectedTempValue)!
    }

    function addSelectedVariant(key: string, value: string) {
        setSelectedVariants({ ...selectedVariants, [key]: value })
    }

    interface AudioTemplate {
        audioBuffers: AudioBuffer[],
        fileName: string
    }

    function createSilenceBuffer(
        channelNo: number = 2, // stereo
        sampleRate: number = crunker.context.sampleRate,
        duration: number,
    ): AudioBuffer {
        return crunker.context.createBuffer(
            channelNo,
            sampleRate * duration,
            sampleRate
        )
    }

    async function getAudioBufferFromLink(link: string): Promise<AudioBuffer> {
        let response = await fetch(link);
        let arrayBuffer = await response.arrayBuffer();
        return await crunker.context.decodeAudioData(arrayBuffer);
    }

    async function fetchAudioTemplate(script: Record<string, string> = getSelectedTemplate().script): Promise<AudioTemplate> {
        let fileName = "cms-"
        let audioBuffers: Promise<AudioBuffer>[] = []

        const snippetsCollection = Object.values(availableSnippetGroups).flat()

        for (const snippetKey of Object.keys(script)) {
            let selectedSnippetVariant = selectedVariants[snippetKey] ??= (availableSnippetGroups)[script[snippetKey]][0]["Snippet Name"]
            fileName += `${selectedSnippetVariant}-`
            if (selectedSnippetVariant.includes("silence")) {
                const silenceDuration = asSilenceFloatOr0(selectedSnippetVariant)
                audioBuffers.push(Promise.resolve(createSilenceBuffer(2, crunker.context.sampleRate, silenceDuration)))
            } else {
                // fetch Audio File and return
                let snippetData = snippetsCollection.find((snippet) => snippet["Snippet Name"] === selectedSnippetVariant)!
                let audioFile = snippetData["Audio File"][0]
                audioBuffers.push(getAudioBufferFromLink(audioFile.url))
            }
        }


        return {
            audioBuffers: await Promise.all(audioBuffers),
            fileName: fileName
        }
    }

    return (
        <Page>
            {(isLoading) ? (<LoadingSpinner />) : null}
            <CreateTopBar
                onGenerateClick={async () => {
                    setIsLoading(true)
                    //return
                    try {
                        let audioTemplate = await fetchAudioTemplate()
                        MyLogger.info(audioTemplate.fileName, "fileName")
                        let mergedAudio = await crunker.concatAudio(audioTemplate.audioBuffers)
                        let exportedAudio = await crunker.export(mergedAudio, 'audio/wav')
                        crunker.download(exportedAudio.blob, audioTemplate.fileName)
                    } catch (error) {
                        throw error;
                    } finally {
                        setIsLoading(false)
                    }
                }}
            />

            <Section>
                {"Templates"}
                <SectionContent>
                    <TemplatePicker
                        allTemplates={availableTemplates}
                        selectedTemplate={selectedTemplateValue}
                        onTemplateChange={onTemplateChange}
                    />
                </SectionContent>
            </Section>

            <Section>
                {"Meditation Script"}
                <BlackButton2 style={{ marginLeft: "20px" }}>Randomise <ShuffleIcon /></BlackButton2>
                <br />
                <br />
                {getSelectedTemplate()?.script &&
                    Object.entries(getSelectedTemplate().script).map(([snippetKey, snippetValue]) => {
                        let obj = availableSnippetGroups[snippetValue]?.find((obj) => { return selectedVariants[snippetKey] === obj.value })

                        return <SectionContent key={snippetKey}>
                            {snippetValue.includes("silence")
                                ? <SilencePicker
                                    key={snippetKey}
                                    defaultSilenceDuration={asSilenceFloatOr0(snippetValue)}
                                    selectedSilenceDuration={asSilenceFloatOr0(selectedVariants[snippetKey] ?? snippetValue)}
                                    onSilenceDurationChange={(event) => {
                                        MyLogger.info(event.target.value, `Silence Change ${snippetKey}`)
                                        addSelectedVariant(snippetKey, `silence${event.target.value}`)
                                    }}
                                /> :
                                (<><SnippetGroupPicker
                                    title={snippetValue ?? "No Snippet Group Selected"}
                                    avlblVariants={(availableSnippetGroups as any)[snippetValue] ?? []}
                                    selectedVariant={selectedVariants[snippetKey]}
                                    onVariantChange={(event) => {
                                        addSelectedVariant(snippetKey, event.target.value)
                                    }}
                                />
                                    <br />
                                    <SnippetText>{obj &&
                                        obj['Snippet Text']}</SnippetText></>)
                            }

                        </SectionContent>

                    })}
            </Section>
        </Page >
    )
}

export default CreatePage