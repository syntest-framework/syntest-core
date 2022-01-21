import { JavaScriptTestCaseSampler } from "./JavaScriptTestCaseSampler";
import { JavaScriptTestCase } from "../JavaScriptTestCase";
import { FunctionDescription, Parameter, prng, Properties } from "@syntest/framework";
import { ConstructorCall } from "../statements/root/ConstructorCall";
import { MethodCall } from "../statements/action/MethodCall";
import { BoolStatement } from "../statements/primitive/BoolStatement";
import { StringStatement } from "../statements/primitive/StringStatement";
import { NumericStatement } from "../statements/primitive/NumericStatement";
import { RootStatement } from "../statements/root/RootStatement";
import { Statement } from "../statements/Statement";
import { FunctionCall } from "../statements/root/FunctionCall";
import { JavaScriptSubject, SubjectType } from "../../search/JavaScriptSubject";


export class JavaScriptRandomSampler extends JavaScriptTestCaseSampler {

  constructor(subject: JavaScriptSubject) {
    super(subject);
  }


  sample(): JavaScriptTestCase {
    let root: RootStatement

    if ((<JavaScriptSubject>this._subject).type === SubjectType.function) {
      root = this.sampleFunctionCall(0)
    } else if ((<JavaScriptSubject>this._subject).type === SubjectType.class) {
      root = this.sampleConstructor(0)
    }

    // TODO could also be static access object

    return new JavaScriptTestCase(root);
  }

  sampleFunctionCall(depth: number): FunctionCall {
    const action = <FunctionDescription>(
      prng.pickOne(this._subject.getPossibleActions("function"))
    );

    const args: Statement[] = [];

    for (const param of action.parameters) {
      if (param.type != "")
        args.push(
          this.sampleArgument(depth + 1, param)
        );
    }

    return new FunctionCall(
      action.returnParameters[0],
      prng.uniqueId(),
      action.name,
      args
    );
  }

  sampleConstructor(depth: number): ConstructorCall {
    const constructors = this._subject.getPossibleActions("constructor");

    if (constructors.length > 0) {
      const action = <FunctionDescription>(
        prng.pickOne(constructors)
      );

      const args: Statement[] = []
      action.parameters
        .forEach((param) => {
          if (param.type != "") {
            args.push(
              this.sampleArgument(depth + 1, param)
            );
          }
        })

      const calls: Statement[] = []
      const nCalls = prng.nextInt(1, Properties.max_action_statements);
      for (let i = 0; i < nCalls; i++) {
        calls.push(this.sampleMethodCall(depth + 1))
      }

      return new ConstructorCall(
        { type: this.subject.name, name: "class" },
        prng.uniqueId(),
        args,
        calls,
        `${this.subject.name}`
      );
    } else {
      // if no constructors is available, we invoke the default (implicit) constructor

      const calls: Statement[] = []
      const nCalls = prng.nextInt(1, Properties.max_action_statements);
      for (let i = 0; i < nCalls; i++) {
        calls.push(this.sampleMethodCall(depth + 1))
      }

      return new ConstructorCall(
        { type: this._subject.name, name: "class" },
        prng.uniqueId(),
        [],
        calls,
        `${this._subject.name}`
      );
    }
  }

  sampleMethodCall(depth: number) {
    const action = <FunctionDescription>(
      prng.pickOne(this._subject.getPossibleActions("method"))
    );

    const args: Statement[] = [];

    for (const param of action.parameters) {
      if (param.type != "")
        args.push(
          this.sampleArgument(depth + 1, param)
        );
    }

    return new MethodCall(
      action.returnParameters[0],
      prng.uniqueId(),
      action.name,
      args
    );
  }

  sampleArgument(depth: number, type: Parameter): Statement {

    // TODO sampling arrays or objects
    // TODO more complex sampling of function return values
    // Take regular primitive value
    return this.samplePrimitive(depth, type);
  }

  samplePrimitive(depth: number, type: Parameter): Statement {
    if (type.type === "bool") {
      return BoolStatement.getRandom(type);
    } else if (type.type === "string") {
      return StringStatement.getRandom(type);
    } else if (type.type === "number") {
      return NumericStatement.getRandom(type);
    } else if (type.type === "any") {
      // TODO
      const choice = prng.nextInt(0, 2)
      if (choice === 0) {
        return BoolStatement.getRandom(type);
      } else if (choice === 1) {
        return StringStatement.getRandom(type);
      } else {
        return NumericStatement.getRandom(type);
      }
    }

    throw new Error(`Unknown type '${type.type}'!`);
  }

}