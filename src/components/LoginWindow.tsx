import { Input, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fragment } from 'react/jsx-runtime'
import clsx from "clsx"
import { useState } from 'react'
import SelectPlan from './SelectPlan'

const LoginWindow = () => {

    const [signedIn, setSignedIn] = useState(false)
    const [existingUser, setExistingUser] = useState(false)

    const userAuth = () : boolean => {
        console.log("Checking user auth")
        // API call

        return true
    }

    // TODO: failedAuth
    const failedAuth = () => {
        console.log("User failed auth")
        // Failed to log in styling
    }

    // TODO: matchPass
    const matchPass = () => {
        console.log("Passwords did not match")
        // Failed to match passwords styling
    }

    const userSignup = () : boolean => {
        console.log("Signing up user")
        // API call

        return true
    }

    const signupFailed = () => {
        console.log("Failed to signup")
    }

    return (
        <>
            {/* TODO: remove later */}
            <div className="absolute size-full bg-[#154734]"></div>

            {!signedIn ? (
                <>
                    <TabGroup className="absolute border-2 border-black rounded-lg w-8/10 max-w-120 h-fit inset-0 m-auto p-4 py-8 bg-white">
                        <TabList className="flex flex-row justify-between mb-8">
                            <Tab as={Fragment}>
                                {({ hover, selected}) => (
                                    <button className="flex flex-col items-center text-xl w-full focus:outline-0">
                                        Login
                                        <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ hover, selected}) => (
                                    <button className="flex flex-col items-center text-xl w-full focus:outline-0">
                                        Sign up
                                        <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                                    </button>
                                )}
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <form
                                    method="post"
                                    onSubmit={async (event) => {
                                        event.preventDefault()
                                        const form = event.target as HTMLFormElement
                                        const formData = new FormData(form)
                                        const email = formData.get("email") as string
                                        const pass = formData.get("pass") as string
                                        if (userAuth()) {
                                            setSignedIn(true)
                                            setExistingUser(true)
                                        }
                                        else {
                                            failedAuth()
                                        }
                                    }}
                                    className="flex flex-col gap-2 px-4"
                                >
                                    <label>
                                        <Input 
                                            name="email" 
                                            placeholder="Email" 
                                            type="text" 
                                            className={"border-2 border-black rounded-md px-2 h-10 w-full"}></Input>
                                    </label>
                                    <label>
                                        <Input
                                            name="pass"
                                            placeholder="Password"
                                            type="text"
                                            className={"border-2 border-black rounded-md px-2 h-10 w-full"}
                                        ></Input>
                                    </label>
                                    <button type="submit" name="submit" value="Submit" className="border-2 border-black rounded-md p-2 px-4 bg-[#e87500] hover:bg-[#c95100] text-white self-end">
                                        Login
                                    </button>
                                </form>
                            </TabPanel>
                            <TabPanel>
                                <form
                                    method="post"
                                    onSubmit={async (event) => {
                                        event.preventDefault()
                                        const form = event.target as HTMLFormElement
                                        const formData = new FormData(form)
                                        const email = formData.get("email") as string
                                        const pass = formData.get("pass") as string
                                        const confirm = formData.get("confirm") as string
                                        if (pass !== confirm)
                                            matchPass()  
                                        else {
                                            if (userSignup()) {
                                                setSignedIn(true)
                                                setExistingUser(false)
                                            }
                                            else {
                                                signupFailed()
                                            }
                                        }        
                                    }}
                                    className="flex flex-col gap-2 px-4"
                                >
                                    <label>
                                        <Input 
                                            name="email" 
                                            placeholder="Email" 
                                            type="text" 
                                            className={"border-2 border-black rounded-md px-2 h-10 w-full"}></Input>
                                    </label>
                                    <label>
                                        <Input
                                            name="pass"
                                            placeholder="Password"
                                            type="text"
                                            className={"border-2 border-black rounded-md px-2 h-10 w-full"}
                                        ></Input>
                                    </label>
                                    <label>
                                        <Input
                                            name="confirm"
                                            placeholder="Confirm Password"
                                            type="text"
                                            className={"border-2 border-black rounded-md px-2 h-10 w-full"}
                                        ></Input>
                                    </label>
                                    <button type="submit" name="submit" value="Submit" className="border-2 border-black rounded-md p-2 px-4 bg-[#e87500] hover:bg-[#c95100] text-white self-end">
                                        Sign up
                                    </button>
                                </form>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </>
            ) : (
                <>
                    <SelectPlan existingUser={existingUser}></SelectPlan>
                </>
            )}
        </>
    )
}

export default LoginWindow