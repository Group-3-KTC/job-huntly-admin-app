import { Listbox, Transition } from "@headlessui/react";
import { CaretDown } from "phosphor-react";
import { Fragment } from "react";
import type { TicketStatus } from "../../../types/mail.type.ts";

export default function StatusDropdown({
                                           value,
                                           onChange,
                                       }: { value: TicketStatus; onChange: (s: TicketStatus) => void }) {
    const options: TicketStatus[] = ["OPEN", "PENDING", "CLOSED"];
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="inline-flex items-center gap-1 px-3 py-2 border rounded-xl text-sm">
                    {value} <CaretDown size={16} />
                </Listbox.Button>
                <Transition as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                >
                    <Listbox.Options className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-10">
                        {options.map(opt => (
                            <Listbox.Option key={opt} value={opt}
                                            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                            >
                                {opt}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
