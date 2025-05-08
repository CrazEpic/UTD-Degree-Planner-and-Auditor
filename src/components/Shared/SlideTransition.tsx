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
            enterFrom="lg:-translate-x-full max-lg:max-h-0 opacity-0"
            enterTo="lg:translate-x-0 max-lg:max-h-50 opacity-100"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="lg:translate-x-0 max-lg:max-h-50 opacity-100"
            leaveTo="lg:-translate-x-full max-lg:max-h-0 opacity-0"
        >
            <div>{children}</div>
        </Transition>
    )
}

export default SlideTransition