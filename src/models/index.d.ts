import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Link {
  readonly id: string;
  readonly key?: string;
  readonly destination?: string;
  constructor(init: ModelInit<Link>);
  static copyOf(source: Link, mutator: (draft: MutableModel<Link>) => MutableModel<Link> | void): Link;
}