import { ReactNode } from "react"
import { Transition } from "@headlessui/react"

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
            enterFrom="-translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="-translate-x-full opacity-0"
        >
            <div>{children}</div>
        </Transition>
    )
}

export default SlideTransition