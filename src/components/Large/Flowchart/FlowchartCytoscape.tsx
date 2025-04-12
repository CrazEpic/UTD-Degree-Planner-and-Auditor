import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useEffect } from "react"

cytoscape.use(dagre)

let cy: cytoscape.Core

// for requisites, can only handle matchers and course types

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
	useEffect(() => {
		cy = cytoscape({
			container: document.getElementById("cy"),
			elements: nodes.concat(prereqs).concat(coreqs),
			style: [],
			layout: {
				name: "dagre",
				// @ts-expect-error: dagre import is not typed here
				nodeDimensionsIncludeLabels: true,
			},
		})
	})

	return (
		<>
			<div className="relative h-[75vh] border-4 border-black m-10">
				<div id="cy" className="w-full h-full"></div>
			</div>
		</>
	)
}

export default FlowchartCytoscape
