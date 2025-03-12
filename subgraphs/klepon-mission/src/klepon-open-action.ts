import { NewFactoryDeployment as NewFactoryDeploymentEvent } from "../generated/KleponOpenAction/KleponOpenAction";
import { NewFactoryDeployment } from "../generated/schema";
import { KleponMissionData } from "../generated/templates";

export function handleNewFactoryDeployment(
  event: NewFactoryDeploymentEvent,
): void {
  let entity = new NewFactoryDeployment(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.kac = event.params.kac;
  entity.ke = event.params.ke;
  entity.kmd = event.params.kmd;
  entity.km = event.params.km;
  entity.knc = event.params.knc;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  KleponMissionData.create(event.params.kmd);

  entity.save();
}
