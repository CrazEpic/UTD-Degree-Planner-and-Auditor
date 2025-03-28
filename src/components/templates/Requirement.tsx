import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import ProgressBar from "./ProgressBar"

function Requirement() {
  return (
    <>
      <div className="border rounded-[10px] items-center p-[15px] pr-0">
        <Disclosure>
          <div className="grid grid-cols-6 items-center">
            <p className="col-span-3 line-clamp-1">1. Requirement Name</p>
            <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
            <DisclosureButton className="group py-2">
              <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
            </DisclosureButton>
          </div>
          <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
            <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
              <Disclosure>
                <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                <DisclosureButton className="group py-2">
                  <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                </DisclosureButton>
                <DisclosurePanel className="col-span-6">
                  <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                    <Disclosure>
                      <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                      <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                      <DisclosureButton className="group py-2">
                        <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                      </DisclosureButton>
                      <DisclosurePanel className="col-span-6">
                        <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                          <Disclosure>
                            <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                            <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                            <DisclosureButton className="group py-2">
                              <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                            </DisclosureButton>
                            <DisclosurePanel className="col-span-6">
                              This would be a list of courses
                            </DisclosurePanel>
                          </Disclosure>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
              <Disclosure>
                <p className="col-span-3 line-clamp-1">2. Nested Requirement</p>
                <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                <DisclosureButton className="group py-2">
                  <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                </DisclosureButton>
                <DisclosurePanel className="col-span-6">
                  <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                    <Disclosure>
                      <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                      <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                      <DisclosureButton className="group py-2">
                        <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                      </DisclosureButton>
                      <DisclosurePanel className="col-span-6">
                        <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                          <Disclosure>
                            <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                            <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                            <DisclosureButton className="group py-2">
                              <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                            </DisclosureButton>
                            <DisclosurePanel className="col-span-6">
                              This would be a list of courses
                            </DisclosurePanel>
                          </Disclosure>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
              <Disclosure>
                <p className="col-span-3 line-clamp-1">3. Nested Requirement</p>
                <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                <DisclosureButton className="group py-2">
                  <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                </DisclosureButton>
                <DisclosurePanel className="col-span-6">
                  <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                    <Disclosure>
                      <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                      <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                      <DisclosureButton className="group py-2">
                        <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                      </DisclosureButton>
                      <DisclosurePanel className="col-span-6">
                        <div className="border border-r-0 rounded-[10px] rounded-r-none grid grid-cols-6 p-[12px] pr-0 items-center">
                          <Disclosure>
                            <p className="col-span-3 line-clamp-1">1. Nested Requirement</p>
                            <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
                            <DisclosureButton className="group py-2">
                              <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
                            </DisclosureButton>
                            <DisclosurePanel className="col-span-6">
                              This would be a list of courses
                            </DisclosurePanel>
                          </Disclosure>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  )
}

export default Requirement