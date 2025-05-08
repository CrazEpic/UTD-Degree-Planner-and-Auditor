import { Transition } from "@headlessui/react"
import { ReactNode } from "react"

const SlideTransition = ({
    show,
    children
}: {
    show: boolean,
    children: ReactNode,
}) => {
    return (
        <Transition
            as="div"
            show={show}
            enter="transition-all duration-300 ease-in-out"
            enterFrom="max-h-0 opacity-0"
            enterTo="max-h-50 opacity-100"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="max-h-50 opacity-100"
            leaveTo="max-h-0 opacity-0"
        >
            <div>{children}</div>
        </Transition>
    )
}

export default SlideTransition