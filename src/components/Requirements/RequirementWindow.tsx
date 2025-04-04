import { useEffect, useState } from "react"
import { Block, Degree } from "../../types/degreeTest"
import RequirementBlock from "./RequirementBlock"
import axios from "axios"

const defaultBlock : Block = {
    block_id: "",
    block_name: "",
    parent_block_id: "",
    block_position: 0,
    inner_blocks: [],
    blockType: {
      id: "",
      type: 'NonTerminal',
      conditions: {},
    },
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

function parseBlock(data: any) {
  let block = defaultBlock

  block.block_id = data.block_id
  block.block_name = data.block_name
  block.parent_block_id = data.parent_block_id
  block.block_position = data.block_position
  
  // Will become a switch with other types
  if ('NonTerminalBlock' in data) {
    block.blockType = {
      id: data.NonTerminalBlock.id,
      type: 'NonTerminal',
      conditions: data.NonTerminalBlock.conditions,
    }
  }

  if ('CourseBlock' in data) {
    block.blockType = {
      id: data.CourseBlock.id,
      type: 'Course',
      number: data.CourseBlock.number,
      prefix: data.CourseBlock.prefix,
    }
  }

  // If the block is non terminal then generate all inner blocks
  if (block.blockType.type === 'NonTerminal') {
    Object.values(data.inner_blocks).forEach(inner => {
      block.inner_blocks.push(parseBlock(inner))
    })
  }
  return block
}

function parseDegree(data: any) {
  
  let degree : Degree = {
    RootBlock: {
    block_id: "",
    block_name: "",
    parent_block_id: "",
    block_position: 0,
    inner_blocks: [],
    blockType: {
        id: "",
        type: 'NonTerminal',
        conditions: {},
      },
    },
    block_id: "",
    degree_name: "",
    degree_year: "",
  }
  
  degree.RootBlock = parseBlock(data.RootBlock)
  degree.block_id = data.block_id
  degree.degree_name = data.degree_name
  degree.degree_year = data.degree_year
  
  return degree
}

function RequirementWindow() {
    const [d, setD] = useState<Degree>({RootBlock: defaultBlock, block_id: "a", degree_name: "b", degree_year: "c"})
    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await axios.get("http://localhost:3000/api/degree/Computer Science/2025");
                setD(parseDegree(resp.data));
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        console.log("Updated Version?")
        console.log(d)
    }, [d]);
    

    return (
        <> 
            <div className="flex flex-col gap-[8px]">
            {Object.values(d.RootBlock.inner_blocks || {}).map((inner) => 
              <RequirementBlock key={inner.block_id} requirement={inner} depth={1} checkbox={false}></RequirementBlock>
            )}

            {/* 
            {reqList.map((req) =>
                <>
                    <RequirementBlock key={req.id} requirement={req} depth={1} checkbox={false}></RequirementBlock>
                </>
            )}
            */}

            {/* Add a disclosure tag just for the footnotes to hide them when unwanted*/}
            {footnotes.map((footnote) =>
                <p>{footnote}</p>
            )}
            </div>
        </>
    )
}

export default RequirementWindow