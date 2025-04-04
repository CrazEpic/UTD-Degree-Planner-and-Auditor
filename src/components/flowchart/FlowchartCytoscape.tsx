import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useEffect } from "react"

cytoscape.use(dagre)

let cy: cytoscape.Core

const nodes = ["CS 1336", "CS 1337", "CS 2337", "CS 3354", "CS 3345", "ECS 3390", "RHET 1302", "MATH 2413", "MATH 2414", "CS 3341", "CS 2305", "CS 3162"].map(
	(node) => {
		return { data: { id: node } }
	}
)

const prereqs = [
	{ source: "CS 1336", target: "CS 1337" },
	{ source: "CS 1337", target: "CS 2337" },
	{ source: "CS 2337", target: "CS 3345" },
	{ source: "MATH 2413", target: "MATH 2414" },
	{ source: "MATH 2414", target: "CS 3341" },
	{ source: "CS 2305", target: "CS 3345" },
	{ source: "CS 2337", target: "CS 3354" },
	{ source: "RHET 1302", target: "ECS 3390" },
].map((edge) => {
	return { data: { id: `prereq:${edge.source}-${edge.target}`, source: edge.source, target: edge.target, class: "prereq" } }
})

const coreqs = [
	{ source: "CS 3341", target: "CS 3345" },
	{ source: "CS 3345", target: "CS 3162" },
	{ source: "CS 3354", target: "CS 3162" },
	{ source: "ECS 3390", target: "CS 3354" },
].map((edge) => {
	return { data: { id: `coreq:${edge.source}-${edge.target}`, source: edge.source, target: edge.target, class: "coreq" } }
})

const FlowchartCytoscape = () => {
	const setPredecessorSuccessorCounts = () => {
		cy.nodes().forEach((ele) => {
			const predecessorCount = ele.predecessors().nodes().length
			const successorCount = ele.successors().nodes().length
			ele.style({
				label: `${ele.id()} | ${predecessorCount} ${successorCount}`,
				"text-valign": "center",
				"text-halign": "center",
			})
		})
	}

	const getDeepestNode = () => {
		const deepestNode = cy.nodes().max((ele) => {
			return ele.predecessors().length
		})
		return deepestNode
	}

	const getMostImportantWithNoPrereqs = () => {
		const deepestNode = getDeepestNode()
		const predecessors = deepestNode.ele.predecessors().nodes()
		const roots = cy.nodes().roots()
		const filteredPredecessors = predecessors.intersection(roots)
		const mostImportant = filteredPredecessors.max((ele) => {
			return ele.nodes().successors().length
		})
		return mostImportant
	}

	const animateMostImportantWithNoPrereqs = () => {
		const mostImportant = getMostImportantWithNoPrereqs()
		mostImportant.ele.style({
			backgroundColor: "#00FF00",
		})

		setTimeout(() => {
			mostImportant.ele.style({
				backgroundColor: "#FFFFFF",
			})
		}, 3000)
	}

	const popMostImportantWithNoPrereqs = () => {
		const mostImportant = getMostImportantWithNoPrereqs()
		cy.remove(mostImportant.ele)
		setPredecessorSuccessorCounts()
	}

	useEffect(() => {
		cy = cytoscape({
			container: document.getElementById("cy"), // container to render in
			elements: nodes.concat(prereqs).concat(coreqs),
			style: [
				// the stylesheet for the graph
				{
					selector: "node",
					style: {
						"background-color": "#000000",
						content: "data(id)",
						shape: "round-rectangle",
						width: "125px",
						backgroundColor: "#FFFFFF",
						"border-width": 2,
						padding: "10px",
					},
				},
				{
					selector: `edge[class="prereq"]`,
					style: {
						width: 3,
						"line-color": "#000000",
						"target-arrow-color": "#000000",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
					},
				},
				{
					selector: `edge[class="coreq"]`,
					style: {
						width: 3,
						"line-color": "#000000",
						"target-arrow-color": "#000000",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
						"line-style": "dashed",
					},
				},
			],
			layout: {
				name: "dagre",
				// @ts-expect-error: dagre import is not typed here
				nodeDimensionsIncludeLabels: true,
			},
		})

		setPredecessorSuccessorCounts()
	})

	return (
		<>
			<div className="relative h-[75vh] border-4 border-black m-10">
				<div id="cy" className="w-full h-full"></div>
				<div className="top-10 right-10 w-min absolute flex flex-col">
					<button onClick={animateMostImportantWithNoPrereqs} className="cursor-pointer">
						<MagnifyingGlassIcon className="w-8 h-8"></MagnifyingGlassIcon>
					</button>
					<button onClick={popMostImportantWithNoPrereqs} className="cursor-pointer">
						<PlusIcon className="w-8 h-8"></PlusIcon>
					</button>
				</div>
			</div>
		</>
	)
}

export default FlowchartCytoscape
