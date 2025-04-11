export const semesterFromDate = (date): { term: "SPRING" | "SUMMER" | "FALL"; year: number } => {
	const springSemesterStart = new Date(date.getFullYear(), 0)
	const springSemesterEnd = new Date(date.getFullYear(), 4, 31)
	const summerSemesterStart = new Date(date.getFullYear(), 5)
	const summerSemesterEnd = new Date(date.getFullYear(), 7, 24)
	// const fallSemesterStart = new Date(date.getFullYear(), 8)
	// const fallSemesterEnd = new Date(date.getFullYear(), 11, 31)
	if (date >= springSemesterStart && date <= springSemesterEnd) {
		return { term: "SPRING", year: date.getFullYear() }
	} else if (date >= summerSemesterStart && date <= summerSemesterEnd) {
		return { term: "SUMMER", year: date.getFullYear() }
	} else {
		return { term: "FALL", year: date.getFullYear() }
	}
}

export const getNextSemester = (currentSemester: "SPRING" | "SUMMER" | "FALL", currentYear: number) => {
	if (currentSemester === "FALL") {
		return { term: "SPRING", year: currentYear + 1 }
	} else if (currentSemester === "SPRING") {
		return { term: "SUMMER", year: currentYear }
	} else {
		return { term: "FALL", year: currentYear }
	}
}

export const compareSemesters = (
	semester1: { term: "SPRING" | "SUMMER" | "FALL"; year: number },
	semester2: { term: "SPRING" | "SUMMER" | "FALL"; year: number }
) => {
	if (semester1.year != semester2.year) {
		return semester1.year - semester2.year
	}
	const semesters = {
		SPRING: 0,
		SUMMER: 1,
		FALL: 2,
	}
	return semesters[semester1.term] - semesters[semester2.term]
}
