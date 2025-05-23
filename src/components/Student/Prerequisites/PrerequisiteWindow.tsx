import { useEffect, useState } from "react"
import axios from "axios"
import BlockView from "../../Shared/BlockViews/BlockView"
import { Block } from "../../../types/block"
import { Degree } from "../../../types/degree"

function createDefaultBlock(): Block {
    return {
        blockID: '',
        blockName: '',
        parentBlockID: '',
        blockPosition: 0,
        innerBlocks: [],
        blockType: 'NonTerminal',
        blockContent: {
            id: '',
            conditions: {},
        },
    }
}

function parseBlock(data: any) : Block {
    let block = createDefaultBlock()

    block.blockID = data.blockID
    block.blockName = data.blockName
    block.parentBlockID = data.parentBlockID
    block.blockPosition = data.blockPosition

    if(data.NonTerminalBlock) {
        block.blockType = 'NonTerminal'
        block.blockContent = {
            id: data.NonTerminalBlock.id,
            conditions: data.NonTerminalBlock.conditions,
        }

        if (data.innerBlocks && typeof data.innerBlocks === 'object') {
            for (const inner of Object.values(data.innerBlocks)) {
                block.innerBlocks.push(parseBlock(inner))
            }
        }
    }
    else if (data.CourseBlock) {
        block.blockType = 'Course'
        block.blockContent = {
            id: data.CourseBlock.id,
            number: data.CourseBlock.number,
            prefix: data.CourseBlock.prefix,
        }
    }
    else if (data.TextBlock) {
        block.blockType = 'Text'
        block.blockContent = {
            id: data.TextBlock.id,
            text: data.TextBlock.text,
        }
    }
    else if (data.MatcherGroupBlock) {
        block.blockType = 'MatcherGroup'
        block.blockContent = {
            id: data.MatcherGroupBlock.id,
            matcher: data.MatcherGroupBlock.matcher,
        }
    }
    else if (data.FlagToggleBlock) {
        block.blockType = 'FlagToggle'
        block.blockContent = {
            id: data.FlagToggleBlock.id,
            flag: data.FlagToggleBlock.flag,
            flagId: data.FlagToggleBlock.flagId,
        }
    }

    return block
}

function parseDegree(data: any) : Degree {

    let degree : Degree = {
        RootBlock: createDefaultBlock(),
        blockID: "",
        degreeName: "",
        degreeYear: "",
    }

    degree.RootBlock = parseBlock(data.RootBlock)
    degree.blockID = data.blockID
    degree.degreeName = data.degreeName
    degree.degreeYear = data.degreeYear

    return degree
}

// Need a way to differentiate in BlockView from Requirements
function PrerequisiteWindow() {
    const [d, setD] = useState<Degree | null>(null)
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/degree/Computer Science/2025");
                setD(parseDegree(response.data));
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <div className="flex flex-col gap-2 max-lg:mt-4">
                {d?.RootBlock.innerBlocks.map((inner: Block) => 
                    <BlockView key={inner.blockID} requirement={inner} depth={1} checkbox={false}></BlockView>
                )}
            </div>
        </>
    )
}

export default PrerequisiteWindow