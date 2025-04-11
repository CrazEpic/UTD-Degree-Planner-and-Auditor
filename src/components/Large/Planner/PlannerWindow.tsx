import { Block, Course } from "../../../types/degreeTest"
import PlannerSection from "./PlannerSection"
import CourseLink from "../CourseLink"

function createDefaultRequirement(): Block {
    return {
        blockId: "",
        blockName: "Requirement Name",
        parentBlockId: "",
        blockPosition: 0,
        innerBlocks: [],
        blockType: "",
        blockContent: {
            id: "",
            conditions: {},
        }
    }
}

const reqList : Block[] = [
    createDefaultRequirement(),
    createDefaultRequirement(),
    createDefaultRequirement(),
    createDefaultRequirement(),
]

const sections : string[] = [
    "Future Courses", 
    "Fall 2025", 
    "Spring 2026",
    "Fall 2026", 
    "Spring 2027", 
    "Fall 2023 (Past Semester)",
    "Spring 2024 (Past Semester)", 
    "Fall 2024 (Past Semester)", 
    "Spring 2025 (Past Semester)",
    "Test Credits (AP/IB/CLEP/etc.)", 
    "Transferred Credits", 
]

const courseList : Course[] = [
    {
        prefix: "CS",
        number: "1234",
        name: "Course Name",
        flag: "AP"
    },
    {
        prefix: "SE",
        number: "2234",
        name: "Course Name",
        flag: "T"
    },
    {
        prefix: "CE",
        number: "3234",
        name: "Course Name",
        flag: "?"
    },
    {
        prefix: "MATH",
        number: "4234",
        name: "Course Name",
        flag: ""
    },
    {
        prefix: "PHYS",
        number: "5234",
        name: "Course Name",
        flag: ""
    },
]

function createDefaultCourse(): Course {
    return {
        prefix: "CR",
        number: "1234",
        name: "Default Course",
        flag: "",
    }
}

const courseBySection : Course[][] = [
    courseList,
    courseList,
    courseList,
]

// Sections and courseLists are currently parallel lists for this information
function renderSectionContent(sections: string[], courseLists: Course[][]) {
    let content = []
    for (let i = 0; i < sections.length; i++) {
        if (courseLists[i]) {
            content.push(<PlannerSection name={sections[i]} courseList={courseLists[i]}></PlannerSection>)
        }
        else {
            content.push(<PlannerSection name={sections[i]} courseList={[createDefaultCourse(), createDefaultCourse()]}></PlannerSection>)
        }
    }
    return content
}

function PlannerWindow() {

    const section = true
    const course = {
        name: "Differential Calculus",
        hours: 4,
    }

    // Sections and courseBySection can be replaced by DB information once I have the format of those
    return (
        <> 
            {/* Want to overlay this over the rendered content rather than instead of */}
            {section ? (
                <>
                    <div className="w-[375px] m-auto">
                        <CourseLink name={course.name} hours={course.hours} requirementList={reqList}></CourseLink>
                    </div>
                </>
            ) : (
                <>
                    {renderSectionContent(sections, courseBySection)}
                </>
            )}
        </>
    )
}

export default PlannerWindow