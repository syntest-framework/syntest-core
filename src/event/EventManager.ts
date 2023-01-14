/*
 * Copyright 2020-2023 Delft University of Technology and SynTest contributors
 *
 * This file is part of SynTest Framework.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CorePluginInterface } from "./CorePluginInterface";
import { Encoding } from "..";
import { ProgramState } from "./ProgramState";

export default class EventManager<T extends Encoding> {

    private state: ProgramState<T>
    private listeners: CorePluginInterface<T>[]

    constructor(state: ProgramState<T>) {
        this.state = state
    }

    registerListener(listener: CorePluginInterface<T>) {
        this.listeners.push(listener)
    }

    removeListener(listener: CorePluginInterface<T>) {
        this.listeners.splice(this.listeners.indexOf(listener))
    }

    emitEvent(event: keyof CorePluginInterface<T>) {
        for (const listener of this.listeners) {
            if (!listener[event]) {
                continue
            }
            (<Function><unknown>listener[event])(this.state)
        }
    }
}