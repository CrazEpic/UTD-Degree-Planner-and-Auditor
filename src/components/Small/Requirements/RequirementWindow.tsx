import { useEffect, useState } from "react"
import { Block, Degree } from "../../../types/degreeTest"
import BlockView from "../BlockView"
import axios from "axios"

function createDefaultBlock() : Block {
    return {
        blockId: '',
        blockName: '',
        parentBlockId: '',
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

    block.blockId = data.blockId
    block.blockName = data.blockName
    block.parentBlockId = data.parentBlockId
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
        blockId: "",
        degreeName: "",
        degreeYear: "",
    }

    degree.RootBlock = parseBlock(data.RootBlock)
    degree.blockId = data.blockId
    degree.degreeName = data.degreeName
    degree.degreeYear = data.degreeYear

    return degree
}

const footnotes : string[] = [
    "1. Curriculum Requirements can be fulfilled by other approved courses. The courses listed are recommended as the most efficient way to satisfy both Core Curriculum and Major Requirements at UT Dallas.",
    "2. Semester credit hours fulfill the communication component of the Core Curriculum.",
    "3. Three semester credit hours of Calculus are counted under Mathematics Core, and five semester credit hours of Calculus are counted as Component Area Option Core.",
    "4. Six semester credit hours of Physics are counted under Science core, and one semester credit hour of Physics (PHYS 2125) is counted as Component Area Option Core.",
    "5. Transfer students with sufficient background may petition to substitute upper-division semester credit hours in the major for this class.",
    "6. BS in Data Science students can substitute MATH 3315 for CS 2305.",
    "7. BS in Data Science students can substitute STAT 3355 for CS 3341.",
]

// Currently does not work because of camelCase change not merged
function RequirementWindow({degreeName, degreeYear}) {
    const [degree, setDegree] = useState<Degree | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/degree/${degreeName}/${degreeYear}`);
                setDegree(parseDegree(response.data));
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [degreeName, degreeYear])
    
    return (
        <> 
            <div className="flex flex-col gap-2 max-lg:mt-4">
                {degree?.RootBlock.innerBlocks.map((inner: Block) => 
                    <BlockView key={inner.blockId} requirement={inner} depth={1} checkbox={false}></BlockView>
                )}

                {/* Add unrelated courses */}
                <BlockView requirement={
                        {
                            blockId: '',
                            blockName: 'Unrelated Courses',
                            parentBlockId: '',
                            blockPosition: 0,
                            innerBlocks: [
                                {
                                    blockId: '',
                                    blockName: '',
                                    parentBlockId: '',
                                    blockPosition: 0,
                                    innerBlocks: [],
                                    blockType: 'MatcherGroup',
                                    blockContent: {
                                        id: '',
                                        conditions: {},
                                    },
                                }
                            ],
                            blockType: 'NonTerminal',
                            blockContent: {
                                id: '',
                                conditions: {},
                            },
                        }
                } depth={1} checkbox={false}></BlockView>

                {/* Add a disclosure tag just for the footnotes to hide them when unwanted*/}
                {footnotes.map((footnote) =>
                    <p>{footnote}</p>
                )}
            </div>
        </>
    )
}

export default RequirementWindow