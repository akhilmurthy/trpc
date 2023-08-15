import { AnyRootConfig } from './internals/config';
import { ProcedureCallOptions } from './internals/procedureBuilder';
import { UnsetMarker } from './internals/utils';
import { ProcedureType } from './types';

type ClientContext = Record<string, unknown>;

/**
 * @internal
 */
export interface ProcedureOptions {
  /**
   * Client-side context
   */
  context?: ClientContext;
  signal?: AbortSignal;
}

/**
 * @internal
 */
export type AnyProcedureParams = {
  _config: AnyRootConfig;
  _meta: unknown;
  _ctx_out: unknown;
  _input_in: unknown;
  _input_out: unknown;
  _output_in: unknown;
  _output_out: unknown;
};

/**
 * @internal
 */
export type ProcedureParams<TParams extends AnyProcedureParams> = TParams;

/**
 * @internal
 */
export type ProcedureArgs<TParams extends ProcedureParams<AnyProcedureParams>> =
  TParams['_input_in'] extends UnsetMarker
    ? [input?: undefined | void, opts?: ProcedureOptions]
    : undefined extends TParams['_input_in']
    ? [input?: TParams['_input_in'] | void, opts?: ProcedureOptions]
    : [input: TParams['_input_in'], opts?: ProcedureOptions];

interface BuiltProcedureDef {
  input: unknown;
  output: unknown;
}
/**
 *
 * @internal
 */
export interface Procedure<
  TType extends ProcedureType,
  TDef extends BuiltProcedureDef,
> {
  _type: TType;
  _def: {
    _input_in: TDef['input'];
    _output_out: TDef['output'];
  };
  _procedure: true;
  /**
   * @internal
   */
  (opts: ProcedureCallOptions): Promise<unknown>;
}

export interface QueryProcedure<TDef extends BuiltProcedureDef>
  extends Procedure<'query', TDef> {}

export interface MutationProcedure<TDef extends BuiltProcedureDef>
  extends Procedure<'mutation', TDef> {}

export interface SubscriptionProcedure<TDef extends BuiltProcedureDef>
  extends Procedure<'subscription', TDef> {}

export type AnyQueryProcedure = QueryProcedure<any>;
export type AnyMutationProcedure = MutationProcedure<any>;
export type AnySubscriptionProcedure = SubscriptionProcedure<any>;
export type AnyProcedure = Procedure<ProcedureType, any>;
