import { Page, Section, SectionContent } from "../CreateStyles";
import {
    TemplateInfoForm,
    RowTR, ColTDLabel,
    TemplateNameInput,
    ColTD,
    TechniqueBox,
    DSInfoBox,
    DSBox,
    Line,
    MidLabel,
    AddButton,
    BlackButton,
    TransButton,
    InputBox,
    IconDelete
} from './CreateTemplateStyle'
import CreateTopBar from "./Topbar";
import React, { useState } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DropDownPicker from "../../../DropDownPicker";


const primaryTechniques: string[] = ["breathFocus", "gratitude", "breathControl", "Normal", "Low", "Very-Low"];
const secondaryTechniques: string[] = ["none", "gratitude", "breathControl", "Normal", "Low", "Very-Low"];
const durationLevel: string[] = ["Master", "1", "2", "3", "4", "5", "6", "8", "10", "12", "15", "20", "30"];
const silenceLevel: string[] = ["Master", "Very High", "High", "Normal", "Low", "Very-Low"];

interface TemplateInfoInterface {
    templateID: string;
    templateName: string;
    primaryTechnique: string;
    secondaryTechnique: string[];
}

interface DSInfoInterface {
    duration: string;
    silenceLevel: string;
}

interface CopyDSInfoInterface {
    duration: string;
    silenceLevel: string;
}

interface snippetDataInterface {
    type: "snippet" | "silence";
    value: string;
}

function PrimaryTechniqueElem({ text, active, setTemplateInfoData, templateInfoData }: {
    text: string,
    active: boolean,
    setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
    templateInfoData: TemplateInfoInterface
}) {
    return <>
        <TechniqueBox
            className={active ? "activeTechnique" : ""}
            onClick={() => {
                setTemplateInfoData({ ...templateInfoData, primaryTechnique: text });
            }}>{text}
        </TechniqueBox>
    </>
}

function SecondaryTechniqueElem({ text, active, setTemplateInfoData, templateInfoData }: {
    text: string,
    active: boolean,
    setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
    templateInfoData: TemplateInfoInterface
}) {
    return <>
        <TechniqueBox
            className={active ? "activeTechnique" : ""}
            onClick={() => {
                if (templateInfoData.secondaryTechnique.includes(text))
                    setTemplateInfoData({ ...templateInfoData, secondaryTechnique: templateInfoData.secondaryTechnique.filter((t) => t !== text) });
                else
                    setTemplateInfoData({ ...templateInfoData, secondaryTechnique: [...templateInfoData.secondaryTechnique, text] });
            }}>{text}
        </TechniqueBox>
    </>
}

function TemplateInfo({ setTemplateInfoData, templateInfoData }:
    {
        setTemplateInfoData: React.Dispatch<React.SetStateAction<TemplateInfoInterface>>,
        templateInfoData: TemplateInfoInterface
    }) {
    return <>
        <TemplateInfoForm>
            <RowTR>
                <ColTDLabel>
                    templateID
                </ColTDLabel>
                <ColTD><label>{templateInfoData.templateID}</label>
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    templateName
                </label>
                </ColTDLabel>
                <ColTD>
                    <TemplateNameInput
                        placeholder="Add Name"
                        type="email" id="email"
                        autoComplete="off"
                        onChange={(evt) => {
                            setTemplateInfoData({ ...templateInfoData, templateName: evt.target.value })
                        }}
                        value={templateInfoData.templateName}
                    />
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    primaryTechnique
                </label>
                </ColTDLabel>
                <ColTD>
                    {primaryTechniques.map((technique) => {
                        return <PrimaryTechniqueElem
                            text={technique}
                            key={technique}
                            active={templateInfoData.primaryTechnique === technique}
                            setTemplateInfoData={setTemplateInfoData}
                            templateInfoData={templateInfoData} />
                    })}
                </ColTD>
            </RowTR>
            <RowTR>
                <ColTDLabel><label >
                    secondaryTechnique
                </label>
                </ColTDLabel>
                <ColTD>
                    {secondaryTechniques.map((technique) => {
                        return <SecondaryTechniqueElem
                            text={technique}
                            key={technique}
                            active={templateInfoData.secondaryTechnique.includes(technique)}
                            setTemplateInfoData={setTemplateInfoData}
                            templateInfoData={templateInfoData} />
                    })}
                </ColTD>
            </RowTR>
        </TemplateInfoForm>

    </>
}

function DSDElem({ text, active, exist, setDSInfoData, DSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
    DSInfoData: DSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (exist) setDSInfoData({ ...DSInfoData, duration: text });
            }}>{text}
        </DSBox>
    </>
}

function DSSElem({ text, active, exist, setDSInfoData, DSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
    DSInfoData: DSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (exist) setDSInfoData({ ...DSInfoData, silenceLevel: text });
            }}>{text}
        </DSBox>
    </>
}

function DSInfo({ setDSInfoData, DSInfoData }:
    {
        setDSInfoData: React.Dispatch<React.SetStateAction<DSInfoInterface>>,
        DSInfoData: DSInfoInterface
    }) {
    return <>
        <DSInfoBox>
            <TemplateInfoForm>
                <RowTR>
                    <ColTDLabel><label >
                        Duration
                    </label>
                    </ColTDLabel>
                    <ColTD>
                        {durationLevel.map((level) => {
                            return <>
                                <DSDElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.duration === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={true}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
                <RowTR>
                    <ColTDLabel><label >
                        Silence Level
                    </label>
                    </ColTDLabel>
                    <ColTD>
                        {silenceLevel.map((level) => {
                            return <>
                                <DSSElem
                                    text={level}
                                    key={level}
                                    active={DSInfoData.silenceLevel === level}
                                    setDSInfoData={setDSInfoData}
                                    DSInfoData={DSInfoData}
                                    exist={true}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
            </TemplateInfoForm>
        </DSInfoBox>
    </>
}


function CopyDSDElem({ text, active, exist, setCpoyDSInfoData, CopyDSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setCpoyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
    CopyDSInfoData: CopyDSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (exist) setCpoyDSInfoData({ ...CopyDSInfoData, duration: text });
            }}>{text}
        </DSBox>
    </>
}

function CopyDSSElem({ text, active, exist, setCpoyDSInfoData, CopyDSInfoData }: {
    text: string,
    active: boolean,
    exist: boolean,
    setCpoyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
    CopyDSInfoData: CopyDSInfoInterface
}) {
    return <>
        <DSBox
            className={(!exist && "notexistDSbox") || (exist && active && "activeDSbox") || ""}
            onClick={() => {
                if (exist) setCpoyDSInfoData({ ...CopyDSInfoData, silenceLevel: text });
            }}>{text}
        </DSBox>
    </>
}

function DSCopyInfo({ setCpoyDSInfoData, CopyDSInfoData }:
    {
        setCpoyDSInfoData: React.Dispatch<React.SetStateAction<CopyDSInfoInterface>>,
        CopyDSInfoData: CopyDSInfoInterface
    }) {
    return <>
        <DSInfoBox>
            <TemplateInfoForm>
                <RowTR>
                    <ColTD>
                        {durationLevel.map((level) => {
                            return <>
                                <CopyDSDElem
                                    text={level}
                                    key={level}
                                    active={CopyDSInfoData.duration === level}
                                    setCpoyDSInfoData={setCpoyDSInfoData}
                                    CopyDSInfoData={CopyDSInfoData}
                                    exist={true}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
                <RowTR>
                    <ColTD>
                        {silenceLevel.map((level) => {
                            return <>
                                <CopyDSSElem
                                    text={level}
                                    key={level}
                                    active={CopyDSInfoData.silenceLevel === level}
                                    setCpoyDSInfoData={setCpoyDSInfoData}
                                    CopyDSInfoData={CopyDSInfoData}
                                    exist={true}
                                />
                            </>
                        })}
                    </ColTD>
                </RowTR>
            </TemplateInfoForm>
        </DSInfoBox>
    </>
}

function SnippetContainer({ setSnippetData, snippetData, options, idx }:
    {
        setSnippetData: React.Dispatch<React.SetStateAction<snippetDataInterface[]>>,
        snippetData: snippetDataInterface[],
        options: string[],
        idx: number
    }) {

    return <>
        <TemplateInfoForm>
            <IconDelete><DeleteIcon style={{ float: "right" }} onClick={
                () => {
                    setSnippetData(snippetData.filter((elem, index) => index !== idx))
                }
            } /></IconDelete>

            <RowTR>
                <ColTDLabel><label >
                    {idx + 1}. snippetGroupName
                </label>
                </ColTDLabel>
                <ColTD>
                    <DropDownPicker
                        title={""}
                        options={options.map((op) => { return { label: op, value: op } })}
                        selectedValue={snippetData[idx].value}
                        onChange={(evt) => {
                            let copy = [...snippetData];
                            copy[idx].value = evt.target.value;
                            setSnippetData(copy);
                        }}
                    />
                </ColTD>
            </RowTR>
        </TemplateInfoForm>
    </>

}

function SilenceContainer({ setSnippetData, snippetData, idx }:
    {
        setSnippetData: React.Dispatch<React.SetStateAction<snippetDataInterface[]>>,
        snippetData: snippetDataInterface[],
        idx: number
    }) {

    return <>
        <TemplateInfoForm>
            <IconDelete><DeleteIcon style={{ float: "right" }} onClick={
                () => {
                    setSnippetData(snippetData.filter((elem, index) => index !== idx))
                }
            } /></IconDelete>

            <RowTR>
                <ColTDLabel><label >
                    {idx + 1}. silenceDuration
                </label>
                </ColTDLabel>
                <ColTD>
                    <InputBox
                        value={snippetData[idx].value}
                        placeholder={"Time in sec"}
                        onChange={(event) => {
                            let copy = [...snippetData]
                            copy[idx].value = event.target.value
                            if ((!isNaN(parseFloat(copy[idx].value)) && isFinite(Number(copy[idx].value))) || event.target.value === "")
                                setSnippetData(copy)
                        }}
                    />
                </ColTD>
            </RowTR>
        </TemplateInfoForm>
    </>

}



function CreatePage() {
    const [templateInfoData, setTemplateInfoData] = useState<TemplateInfoInterface>(
        {
            templateID: "tID11",
            templateName: "",
            primaryTechnique: primaryTechniques[0],
            secondaryTechnique: [secondaryTechniques[0]],
        });
    const [DSInfoData, setDSInfoData] = useState<DSInfoInterface>(
        {
            duration: durationLevel[0],
            silenceLevel: silenceLevel[0]
        });

    const [CopyDSInfoData, setCpoyDSInfoData] = useState<CopyDSInfoInterface>(
        {
            duration: durationLevel[0],
            silenceLevel: silenceLevel[0]
        });

    const [snippetData, setSnippetData] = useState<snippetDataInterface[]>(
        []);

    return (
        <Page>
            {/* {(isLoading) ? (<LoadingSpinner/>) : null} */}
            <CreateTopBar />

            <Section>
                {"Templates/Create"}
                <span style={{ float: "right" }}>
                    <TransButton
                    >
                        Delete Template
                    </TransButton>
                    <BlackButton
                    >
                        Save Template
                    </BlackButton>
                </span>
                <br />
                <br />
                <br />
                <SectionContent>
                    <TemplateInfo setTemplateInfoData={setTemplateInfoData} templateInfoData={templateInfoData} />
                </SectionContent>
            </Section>

            <Section>
                <DSInfo
                    DSInfoData={DSInfoData}
                    setDSInfoData={setDSInfoData}
                />
            </Section>
            <center>

                <Line />
                <br />
                <br />
            </center>

            {snippetData.map((data, index) => {
                if (data.type === 'silence') {
                    return <SectionContent>
                        <SilenceContainer setSnippetData={setSnippetData} snippetData={snippetData} idx={index} key={index} />
                    </SectionContent>
                }

                return <SectionContent>
                    <SnippetContainer
                        setSnippetData={setSnippetData}
                        snippetData={snippetData}
                        idx={index}
                        key={index}
                        options={["Snippet Group Type", "Welcome", "GoodBye"]}
                    />
                </SectionContent>
            })}
            <center>
                <TemplateInfoForm>
                    <RowTR>
                        <ColTDLabel>
                            <AddButton onClick={
                                () => {
                                    setSnippetData([...snippetData, { type: "snippet", value: "" }])
                                }
                            }><AddCircleOutlineOutlinedIcon />
                                Add snippetGroup</AddButton>
                        </ColTDLabel>
                        <ColTD>
                            <AddButton onClick={
                                () => {
                                    setSnippetData([...snippetData, { type: "silence", value: "" }])
                                }
                            }><AddCircleOutlineOutlinedIcon />
                                Add silenceDuration</AddButton>
                        </ColTD>
                    </RowTR>
                </TemplateInfoForm>
                <br />
                <MidLabel>OR</MidLabel>
                <br />
                <br />
                <br />
                <MidLabel>Copy from a different duration/silence</MidLabel>
                <br />
                <br />
                <br />
            </center>
            <Section>
                <DSCopyInfo
                    CopyDSInfoData={CopyDSInfoData}
                    setCpoyDSInfoData={setCpoyDSInfoData}
                    key={Math.random()}
                />
            </Section>

            <center>
                <BlackButton
                >
                    Copy
                </BlackButton>
                <br />
                <br />
            </center>


        </Page>
    )
}

export default CreatePage

//glpat-fSUPKXwB7uqd2HHf7qVv
//glpat-hEb7WsiryrQKJ3XCt11L