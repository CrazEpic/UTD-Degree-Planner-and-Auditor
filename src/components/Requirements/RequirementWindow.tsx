import { useEffect, useState } from "react"
import { Requirement } from "../../types/degreeTest"
import RequirementBlock from "./RequirementBlock"
import axios from "axios"

const reqList : Requirement[] = [
  { 
    id: 1,
    name: "Core Curriculum",
    matcher: false,
    subReqs: [
      {
        id: 1,
        name: "Communication",
        matcher: true,
        subReqs: [],
        subCourses: [
          {
            id: 1,
            prefix: "RHET",
            number: "1302",
            name: "Rhetoric",
          },
          {
            id: 2,
            prefix: "ECS",
            number: "2390",
            name: "Professional and Technical Communication",
          },
        ],
        condition: "6 Hours",
      },
    ],
    subCourses: [],
    condition: "All Blocks",
  },
  { 
    id: 2,
    name: "Major",
    matcher: false,
    subReqs: [
      {
        id: 1,
        name: "Major Preparatory Courses",
        matcher: false,
        subReqs: [
          {
            id: 1,
            name: "MATH SEQUENCE",
            matcher: false,
            subReqs: [
              {
                id: 1,
                name: "Sequence 1",
                matcher: false,
                subReqs: [],
                subCourses: [
                  {
                    id: 1,
                    prefix: "MATH",
                    number: "2413",
                    name: "Differential Calculus",
                  },
                  {
                    id: 2,
                    prefix: "MATH",
                    number: "2414",
                    name: "Integral Calculus",
                  },
                ],
                condition: "All Blocks",
              },
              {
                id: 2,
                name: "Sequence 2",
                matcher: false,
                subReqs: [],
                subCourses: [
                  {
                    id: 1,
                    prefix: "MATH",
                    number: "2417",
                    name: "Calculus I",
                  },
                  {
                    id: 2,
                    prefix: "MATH",
                    number: "2419",
                    name: "Calculus II",
                  },
                ],
                condition: "All Blocks",
              },
            ],
            subCourses: [],
            condition: "1 Block",
          },
        ],
        subCourses: [
          {
            id: 1,
            prefix: "ECS",
            number: "1100",
            name: "Introduction to Engineering and Computer Science",
          },
          {
            id: 2,
            prefix: "CS",
            number: "1200",
            name: "Introduction to Computer Science and Software Engineering",
          },
        ],
        condition: "24 Hours Beyond Core",
      },
      {
        id: 2,
        name: "Major Core Courses",
        matcher: false,
        subReqs: [],
        subCourses: [
          {
            id: 1,
            prefix: "CS",
            number: "3162",
            name: "Professional Responsibility in Computer Science and Software Engineering",
          },
          {
            id: 2,
            prefix: "CS",
            number: "3341",
            name: "Probability and Statistics in Computer Science and Software Engineering",
          },
        ],
        condition: "36 Hours Beyond Core",
      },
      {
        id: 3,
        name: "Major Technical Electives",
        matcher: true,
        subReqs: [],
        subCourses: [
          {
            id: 1,
            prefix: "CS",
            number: "4314",
            name: "Intelligent Systems Analysis",
          },
          {
            id: 2,
            prefix: "CS",
            number: "4315",
            name: "Intelligent Systems Design",
          },
        ],
        condition: "12 Hours",
      },
    ],
    subCourses: [],
    condition: "All Blocks",
  },
  { 
    id: 3,
    name: "Electives",
    matcher: true,
    subReqs: [],
    subCourses: [],
    condition: "10 Hours",
  },
  { 
    id: 4,
    name: "Unrelated Courses",
    matcher: true,
    subReqs: [],
    subCourses: [],
    condition: "",
  },
]

const footnotes : string[] = [
  "1. Curriculum Requirements can be fulfilled by other approved courses. The courses listed are recommended as the most efficient way to satisfy both Core Curriculum and Major Requirements at UT Dallas.",
  "2. Semester credit hours fulfill the communication component of the Core Curriculum.",
  "3. Three semester credit hours of Calculus are counted under Mathematics Core, and five semester credit hours of Calculus are counted as Component Area Option Core.",
  "4. Six semester credit hours of Physics are counted under Science core, and one semester credit hour of Physics (PHYS 2125) is counted as Component Area Option Core.",
  "5. Transfer students with sufficient background may petition to substitute upper-division semester credit hours in the major for this class.",
  "6. BS in Data Science students can substitute MATH 3315 for CS 2305.",
  "7. BS in Data Science students can substitute STAT 3355 for CS 3341.",
]


function RequirementWindow() {

    const [d, setD] = useState({})
    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await axios.get("http://localhost:3000/api/degree/Computer Science/2025");
                setD(resp.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        console.log(d)
    }, [d]);




    return (
        <> 
            <div className="flex flex-col gap-[8px]">
            {reqList.map((req) =>
                <>
                    <RequirementBlock key={req.id} requirement={req} depth={1} checkbox={false}></RequirementBlock>
                    {/* <RequirementBlock key={req.id} requirement={req} depth={1} checkbox={true}></RequirementBlock> */}
                </>
            )}

            {/* Add a disclosure tag just for the footnotes to hide them when unwanted*/}
            {footnotes.map((footnote) =>
                <p>{footnote}</p>
            )}
            </div>
        </>
    )
}

export default RequirementWindow