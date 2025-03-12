// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class CommunityCreated extends ethereum.Event {
  get params(): CommunityCreated__Params {
    return new CommunityCreated__Params(this);
  }
}

export class CommunityCreated__Params {
  _event: CommunityCreated;

  constructor(event: CommunityCreated) {
    this._event = event;
  }

  get communityId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get steward(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get uri(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class CommunityMemberAdded extends ethereum.Event {
  get params(): CommunityMemberAdded__Params {
    return new CommunityMemberAdded__Params(this);
  }
}

export class CommunityMemberAdded__Params {
  _event: CommunityMemberAdded;

  constructor(event: CommunityMemberAdded) {
    this._event = event;
  }

  get communityId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get memberAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get memberProfileId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CommunityMemberRemoved extends ethereum.Event {
  get params(): CommunityMemberRemoved__Params {
    return new CommunityMemberRemoved__Params(this);
  }
}

export class CommunityMemberRemoved__Params {
  _event: CommunityMemberRemoved;

  constructor(event: CommunityMemberRemoved) {
    this._event = event;
  }

  get communityId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get memberProfileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class CommunityUpdated extends ethereum.Event {
  get params(): CommunityUpdated__Params {
    return new CommunityUpdated__Params(this);
  }
}

export class CommunityUpdated__Params {
  _event: CommunityUpdated;

  constructor(event: CommunityUpdated) {
    this._event = event;
  }

  get communityId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get steward(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get uri(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class PixelCommunityData__getCommunityMembersResultValue0Struct extends ethereum.Tuple {
  get memberAddress(): Address {
    return this[0].toAddress();
  }

  get memberProfileId(): BigInt {
    return this[1].toBigInt();
  }
}

export class PixelCommunityData extends ethereum.SmartContract {
  static bind(address: Address): PixelCommunityData {
    return new PixelCommunityData("PixelCommunityData", address);
  }

  _memberProfileIdToIndex(param0: BigInt, param1: BigInt): BigInt {
    let result = super.call(
      "_memberProfileIdToIndex",
      "_memberProfileIdToIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try__memberProfileIdToIndex(
    param0: BigInt,
    param1: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "_memberProfileIdToIndex",
      "_memberProfileIdToIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  communityCreator(): Address {
    let result = super.call(
      "communityCreator",
      "communityCreator():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_communityCreator(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "communityCreator",
      "communityCreator():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getCommunityIsValidCreator(_creator: Address, _communityId: BigInt): boolean {
    let result = super.call(
      "getCommunityIsValidCreator",
      "getCommunityIsValidCreator(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );

    return result[0].toBoolean();
  }

  try_getCommunityIsValidCreator(
    _creator: Address,
    _communityId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "getCommunityIsValidCreator",
      "getCommunityIsValidCreator(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getCommunityIsValidOrigin(_origin: i32, _communityId: BigInt): boolean {
    let result = super.call(
      "getCommunityIsValidOrigin",
      "getCommunityIsValidOrigin(uint8,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_origin)),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );

    return result[0].toBoolean();
  }

  try_getCommunityIsValidOrigin(
    _origin: i32,
    _communityId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "getCommunityIsValidOrigin",
      "getCommunityIsValidOrigin(uint8,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_origin)),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getCommunityIsValidPixelType(_pixelType: i32, _communityId: BigInt): boolean {
    let result = super.call(
      "getCommunityIsValidPixelType",
      "getCommunityIsValidPixelType(uint8,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_pixelType)),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );

    return result[0].toBoolean();
  }

  try_getCommunityIsValidPixelType(
    _pixelType: i32,
    _communityId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "getCommunityIsValidPixelType",
      "getCommunityIsValidPixelType(uint8,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(_pixelType)),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getCommunityMembers(
    _communityId: BigInt
  ): Array<PixelCommunityData__getCommunityMembersResultValue0Struct> {
    let result = super.call(
      "getCommunityMembers",
      "getCommunityMembers(uint256):((address,uint256)[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toTupleArray<
      PixelCommunityData__getCommunityMembersResultValue0Struct
    >();
  }

  try_getCommunityMembers(
    _communityId: BigInt
  ): ethereum.CallResult<
    Array<PixelCommunityData__getCommunityMembersResultValue0Struct>
  > {
    let result = super.tryCall(
      "getCommunityMembers",
      "getCommunityMembers(uint256):((address,uint256)[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        PixelCommunityData__getCommunityMembersResultValue0Struct
      >()
    );
  }

  getCommunitySteward(_communityId: BigInt): Address {
    let result = super.call(
      "getCommunitySteward",
      "getCommunitySteward(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toAddress();
  }

  try_getCommunitySteward(_communityId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getCommunitySteward",
      "getCommunitySteward(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getCommunitySupply(): BigInt {
    let result = super.call(
      "getCommunitySupply",
      "getCommunitySupply():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getCommunitySupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCommunitySupply",
      "getCommunitySupply():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCommunityURI(_communityId: BigInt): string {
    let result = super.call(
      "getCommunityURI",
      "getCommunityURI(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toString();
  }

  try_getCommunityURI(_communityId: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall(
      "getCommunityURI",
      "getCommunityURI(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  getCommunityValid20AddressKeys(_communityId: BigInt): Array<Address> {
    let result = super.call(
      "getCommunityValid20AddressKeys",
      "getCommunityValid20AddressKeys(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toAddressArray();
  }

  try_getCommunityValid20AddressKeys(
    _communityId: BigInt
  ): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getCommunityValid20AddressKeys",
      "getCommunityValid20AddressKeys(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  getCommunityValid20Threshold(
    _tokenAddress: Address,
    _communityId: BigInt
  ): BigInt {
    let result = super.call(
      "getCommunityValid20Threshold",
      "getCommunityValid20Threshold(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_tokenAddress),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );

    return result[0].toBigInt();
  }

  try_getCommunityValid20Threshold(
    _tokenAddress: Address,
    _communityId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCommunityValid20Threshold",
      "getCommunityValid20Threshold(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_tokenAddress),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCommunityValidCreatorKeys(_communityId: BigInt): Array<Address> {
    let result = super.call(
      "getCommunityValidCreatorKeys",
      "getCommunityValidCreatorKeys(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toAddressArray();
  }

  try_getCommunityValidCreatorKeys(
    _communityId: BigInt
  ): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getCommunityValidCreatorKeys",
      "getCommunityValidCreatorKeys(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  getCommunityValidOriginKeys(_communityId: BigInt): Array<i32> {
    let result = super.call(
      "getCommunityValidOriginKeys",
      "getCommunityValidOriginKeys(uint256):(uint8[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toI32Array();
  }

  try_getCommunityValidOriginKeys(
    _communityId: BigInt
  ): ethereum.CallResult<Array<i32>> {
    let result = super.tryCall(
      "getCommunityValidOriginKeys",
      "getCommunityValidOriginKeys(uint256):(uint8[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32Array());
  }

  getCommunityValidPixelTypeKeys(_communityId: BigInt): Array<i32> {
    let result = super.call(
      "getCommunityValidPixelTypeKeys",
      "getCommunityValidPixelTypeKeys(uint256):(uint8[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );

    return result[0].toI32Array();
  }

  try_getCommunityValidPixelTypeKeys(
    _communityId: BigInt
  ): ethereum.CallResult<Array<i32>> {
    let result = super.tryCall(
      "getCommunityValidPixelTypeKeys",
      "getCommunityValidPixelTypeKeys(uint256):(uint8[])",
      [ethereum.Value.fromUnsignedBigInt(_communityId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32Array());
  }

  getIsCommunityMember(
    _communityId: BigInt,
    _memberProfileId: BigInt
  ): boolean {
    let result = super.call(
      "getIsCommunityMember",
      "getIsCommunityMember(uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_communityId),
        ethereum.Value.fromUnsignedBigInt(_memberProfileId)
      ]
    );

    return result[0].toBoolean();
  }

  try_getIsCommunityMember(
    _communityId: BigInt,
    _memberProfileId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "getIsCommunityMember",
      "getIsCommunityMember(uint256,uint256):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_communityId),
        ethereum.Value.fromUnsignedBigInt(_memberProfileId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getIsValidCommunityAddress(
    _memberAddress: Address,
    _communityId: BigInt
  ): boolean {
    let result = super.call(
      "getIsValidCommunityAddress",
      "getIsValidCommunityAddress(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_memberAddress),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );

    return result[0].toBoolean();
  }

  try_getIsValidCommunityAddress(
    _memberAddress: Address,
    _communityId: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "getIsValidCommunityAddress",
      "getIsValidCommunityAddress(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_memberAddress),
        ethereum.Value.fromUnsignedBigInt(_communityId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getMemberToIndex(_communityId: BigInt, _memberProfileId: BigInt): BigInt {
    let result = super.call(
      "getMemberToIndex",
      "getMemberToIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_communityId),
        ethereum.Value.fromUnsignedBigInt(_memberProfileId)
      ]
    );

    return result[0].toBigInt();
  }

  try_getMemberToIndex(
    _communityId: BigInt,
    _memberProfileId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getMemberToIndex",
      "getMemberToIndex(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_communityId),
        ethereum.Value.fromUnsignedBigInt(_memberProfileId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  pixelAccessControl(): Address {
    let result = super.call(
      "pixelAccessControl",
      "pixelAccessControl():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_pixelAccessControl(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "pixelAccessControl",
      "pixelAccessControl():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _pixelAccessControlAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _communityCreatorAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddCommunityMemberCall extends ethereum.Call {
  get inputs(): AddCommunityMemberCall__Inputs {
    return new AddCommunityMemberCall__Inputs(this);
  }

  get outputs(): AddCommunityMemberCall__Outputs {
    return new AddCommunityMemberCall__Outputs(this);
  }
}

export class AddCommunityMemberCall__Inputs {
  _call: AddCommunityMemberCall;

  constructor(call: AddCommunityMemberCall) {
    this._call = call;
  }

  get _memberAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _communityId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _memberProfileId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class AddCommunityMemberCall__Outputs {
  _call: AddCommunityMemberCall;

  constructor(call: AddCommunityMemberCall) {
    this._call = call;
  }
}

export class CreateCommunityCall extends ethereum.Call {
  get inputs(): CreateCommunityCall__Inputs {
    return new CreateCommunityCall__Inputs(this);
  }

  get outputs(): CreateCommunityCall__Outputs {
    return new CreateCommunityCall__Outputs(this);
  }
}

export class CreateCommunityCall__Inputs {
  _call: CreateCommunityCall;

  constructor(call: CreateCommunityCall) {
    this._call = call;
  }

  get _params(): CreateCommunityCall_paramsStruct {
    return changetype<CreateCommunityCall_paramsStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class CreateCommunityCall__Outputs {
  _call: CreateCommunityCall;

  constructor(call: CreateCommunityCall) {
    this._call = call;
  }
}

export class CreateCommunityCall_paramsStruct extends ethereum.Tuple {
  get validCreators(): Array<Address> {
    return this[0].toAddressArray();
  }

  get validOrigins(): Array<i32> {
    return this[1].toI32Array();
  }

  get validPixelTypes(): Array<i32> {
    return this[2].toI32Array();
  }

  get valid20Addresses(): Array<Address> {
    return this[3].toAddressArray();
  }

  get valid20Thresholds(): Array<BigInt> {
    return this[4].toBigIntArray();
  }

  get uri(): string {
    return this[5].toString();
  }

  get steward(): Address {
    return this[6].toAddress();
  }
}

export class RemoveCommunityMemberCall extends ethereum.Call {
  get inputs(): RemoveCommunityMemberCall__Inputs {
    return new RemoveCommunityMemberCall__Inputs(this);
  }

  get outputs(): RemoveCommunityMemberCall__Outputs {
    return new RemoveCommunityMemberCall__Outputs(this);
  }
}

export class RemoveCommunityMemberCall__Inputs {
  _call: RemoveCommunityMemberCall;

  constructor(call: RemoveCommunityMemberCall) {
    this._call = call;
  }

  get _memberAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _communityId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _memberProfileId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class RemoveCommunityMemberCall__Outputs {
  _call: RemoveCommunityMemberCall;

  constructor(call: RemoveCommunityMemberCall) {
    this._call = call;
  }
}

export class SetCommunityCreatorAddressCall extends ethereum.Call {
  get inputs(): SetCommunityCreatorAddressCall__Inputs {
    return new SetCommunityCreatorAddressCall__Inputs(this);
  }

  get outputs(): SetCommunityCreatorAddressCall__Outputs {
    return new SetCommunityCreatorAddressCall__Outputs(this);
  }
}

export class SetCommunityCreatorAddressCall__Inputs {
  _call: SetCommunityCreatorAddressCall;

  constructor(call: SetCommunityCreatorAddressCall) {
    this._call = call;
  }

  get _newCommunityCreatorAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetCommunityCreatorAddressCall__Outputs {
  _call: SetCommunityCreatorAddressCall;

  constructor(call: SetCommunityCreatorAddressCall) {
    this._call = call;
  }
}

export class SetPixelAccessControlAddressCall extends ethereum.Call {
  get inputs(): SetPixelAccessControlAddressCall__Inputs {
    return new SetPixelAccessControlAddressCall__Inputs(this);
  }

  get outputs(): SetPixelAccessControlAddressCall__Outputs {
    return new SetPixelAccessControlAddressCall__Outputs(this);
  }
}

export class SetPixelAccessControlAddressCall__Inputs {
  _call: SetPixelAccessControlAddressCall;

  constructor(call: SetPixelAccessControlAddressCall) {
    this._call = call;
  }

  get _newPixelAccessControlAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPixelAccessControlAddressCall__Outputs {
  _call: SetPixelAccessControlAddressCall;

  constructor(call: SetPixelAccessControlAddressCall) {
    this._call = call;
  }
}

export class UpdateCommunityCall extends ethereum.Call {
  get inputs(): UpdateCommunityCall__Inputs {
    return new UpdateCommunityCall__Inputs(this);
  }

  get outputs(): UpdateCommunityCall__Outputs {
    return new UpdateCommunityCall__Outputs(this);
  }
}

export class UpdateCommunityCall__Inputs {
  _call: UpdateCommunityCall;

  constructor(call: UpdateCommunityCall) {
    this._call = call;
  }

  get _params(): UpdateCommunityCall_paramsStruct {
    return changetype<UpdateCommunityCall_paramsStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get communityId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UpdateCommunityCall__Outputs {
  _call: UpdateCommunityCall;

  constructor(call: UpdateCommunityCall) {
    this._call = call;
  }
}

export class UpdateCommunityCall_paramsStruct extends ethereum.Tuple {
  get validCreators(): Array<Address> {
    return this[0].toAddressArray();
  }

  get validOrigins(): Array<i32> {
    return this[1].toI32Array();
  }

  get validPixelTypes(): Array<i32> {
    return this[2].toI32Array();
  }

  get valid20Addresses(): Array<Address> {
    return this[3].toAddressArray();
  }

  get valid20Thresholds(): Array<BigInt> {
    return this[4].toBigIntArray();
  }

  get uri(): string {
    return this[5].toString();
  }

  get steward(): Address {
    return this[6].toAddress();
  }
}
