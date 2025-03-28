import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"

function Requirement() {
  return (
    <>
      <div className="border rounded-[10px] grid grid-cols-3 items-center p-[15px]">
        <Disclosure>
          <p className="col-span-2 line-clamp-1">1. Requirement Name</p>
          <DisclosureButton className="group py-2">
            <img className="group-data-[open]:size-7 size-5 justify-self-end"src="" alt="" />
          </DisclosureButton>
          <DisclosurePanel className="grid grid-cols-3 col-span-3">
            <Disclosure>
              <p className="col-span-2 line-clamp-1">1. Nested Requirement</p>
              <DisclosureButton className="group py-2">
                <img className="group-data-[open]:size-6 size-4 justify-self-end"src="" alt="" />
              </DisclosureButton>
              <DisclosurePanel className="col-span-3">
                This is a nested message
              </DisclosurePanel>
            </Disclosure>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  )
}

export default Requirement