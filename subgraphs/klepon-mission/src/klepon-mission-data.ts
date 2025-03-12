import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  log,
  store,
} from "@graphprotocol/graph-ts";
import {
  KleponMissionData,
  MilestoneCompleted as MilestoneCompletedEvent,
  MissionCompleted as MissionCompletedEvent,
  PlayerEligibleToClaimMilestone as PlayerEligibleToClaimMilestoneEvent,
  PlayerJoinedMission as PlayerJoinedMissionEvent,
  PlayerMetricsUpdated as PlayerMetricsUpdatedEvent,
  MissionInstantiated as MissionInstantiatedEvent,
  MissionStatusUpdated as MissionStatusUpdatedEvent,
  MissionDeleted as MissionDeletedEvent,
} from "../generated/templates/KleponMissionData/KleponMissionData";
import { MissionMetadata as MissionMetadataTemplate } from "../generated/templates";
import {
  MilestoneCompleted,
  PlayerEligibleToClaimMilestone,
  PlayerJoinedMission,
  MissionCompleted,
  MissionDeleted,
  PlayerMetricsUpdated,
  MissionInstantiated,
  Milestone,
  Gate,
  MissionStatusUpdated,
  Video,
  ERC20Logic,
  ERC721Logic,
  Reward,
  Player,
  Eligible,
  CompletionActivity,
  VideoActivity,
  MissionMetadata,
} from "../generated/schema";

export function handleMilestoneCompleted(event: MilestoneCompletedEvent): void {
  let entity = new MilestoneCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.playerProfileId),
  );
  entity.missionId = event.params.missionId;
  entity.playerProfileId = event.params.playerProfileId;
  entity.milestone = event.params.milestone;
  entity.contractAddress = event.address;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let currentPlayer = Player.load(
    event.params.playerProfileId.toString() + event.address.toHexString(),
  );

  let missionData = KleponMissionData.bind(event.address);
  const uri = missionData.getMissionURI(entity.missionId);

  if (currentPlayer) {
    let currentEligible = new Eligible(
      event.params.milestone.toString() +
        event.params.playerProfileId.toString() +
        event.params.missionId.toString() +
        uri +
        event.address.toHexString(),
    );

    currentEligible.status = false;

    currentEligible.save();

    let currentCompleted = new CompletionActivity(
      event.params.milestone.toString() +
        event.params.playerProfileId.toString() +
        event.params.missionId.toString() +
        uri +
        event.address.toHexString(),
    );

    currentCompleted.missionId = entity.missionId;
    currentCompleted.milestonesCompleted = entity.milestone;

    currentCompleted.save();

    let completed: Array<string> | null = currentPlayer.milestonesCompleted;

    if (!completed) {
      completed = [];
    }
    completed.push(
      event.params.milestone.toString() +
        event.params.playerProfileId.toString() +
        event.params.missionId.toString() +
        uri +
        event.address.toHexString(),
    );

    currentPlayer.milestonesCompleted = completed;

    currentPlayer.save();
  }

  entity.save();
}

export function handleMissionCompleted(event: MissionCompletedEvent): void {
  let entity = new MissionCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.missionId = event.params.missionId;
  entity.playerProfileId = event.params.playerProfileId;
  entity.contractAddress = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let currentPlayer = Player.load(
    event.params.playerProfileId.toString() + event.address.toHexString(),
  );

  if (currentPlayer) {
    let completedMissions: Array<BigInt> | null = currentPlayer.missionsCompleted;
    if (!completedMissions) {
      completedMissions = [];
    }
    completedMissions.push(entity.missionId);

    currentPlayer.missionsCompleted = completedMissions;

    currentPlayer.save();
  }

  entity.save();
}

export function handlePlayerEligibleToClaimMilestone(
  event: PlayerEligibleToClaimMilestoneEvent,
): void {
  let entity = new PlayerEligibleToClaimMilestone(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.playerProfileId = event.params.playerProfileId;
  entity.missionId = event.params.missionId;
  entity.milestone = event.params.milestone;
  entity.eligibility = event.params.eligibility;
  entity.contractAddress = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let currentPlayer = Player.load(
    event.params.playerProfileId.toString() + event.address.toHexString(),
  );

  let missionData = KleponMissionData.bind(event.address);
  const uri = missionData.getMissionURI(entity.missionId);

  if (currentPlayer) {
    let currentEligible = new Eligible(
      event.params.milestone.toString() +
        event.params.playerProfileId.toString() +
        event.params.missionId.toString() +
        uri +
        event.address.toHexString(),
    );

    currentEligible.milestone = entity.milestone;
    currentEligible.missionId = entity.missionId;
    currentEligible.status = true;

    currentEligible.save();

    let eligibile: Array<string> | null = currentPlayer.eligibile;

    if (!eligibile) {
      eligibile = [];
    }
    eligibile.push(
      event.params.milestone.toString() +
        event.params.playerProfileId.toString() +
        event.params.missionId.toString() +
        uri +
        event.address.toHexString(),
    );

    currentPlayer.eligibile = eligibile;

    currentPlayer.save();
  }

  entity.save();
}

export function handlePlayerJoinedMission(event: PlayerJoinedMissionEvent): void {
  let entity = new PlayerJoinedMission(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.playerProfileId),
  );
  entity.contractAddress = event.address;
  entity.missionId = event.params.missionId;
  entity.playerProfileId = event.params.playerProfileId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let currentPlayer = Player.load(
    event.params.playerProfileId.toString() + event.address.toHexString(),
  );

  if (!currentPlayer) {
    currentPlayer = new Player(
      event.params.playerProfileId.toString() + event.address.toHexString(),
    );
    currentPlayer.profileId = event.params.playerProfileId;
    currentPlayer.contractAddress = event.address;
  }

  if (currentPlayer) {
    let missionsJoined: Array<BigInt> | null = currentPlayer.missionsJoined;

    if (!missionsJoined) {
      missionsJoined = [];
    }
    missionsJoined.push(entity.missionId);
    currentPlayer.missionsJoined = missionsJoined;

    currentPlayer.save();
  }

  let mission = MissionInstantiated.load(
    event.params.missionId.toString() + event.address.toHexString(),
  );

  if (mission) {
    let players: Array<string> | null = mission.players;

    if (!players) {
      players = [];
    }

    players.push(
      event.params.playerProfileId.toString() + event.address.toHexString(),
    );
    mission.players = players;
    mission.save();
  }

  entity.save();
}

export function handlePlayerMetricsUpdated(
  event: PlayerMetricsUpdatedEvent,
): void {
  let entity = new PlayerMetricsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.playerProfileId),
  );
  entity.contractAddress = event.address;
  entity.playerProfileId = event.params.playerProfileId;
  entity.videoPubId = event.params.videoPubId;
  entity.videoProfileId = event.params.videoProfileId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let currentPlayer = Player.load(
    event.params.playerProfileId.toString() + event.address.toHexString(),
  );

  let missionData = KleponMissionData.bind(event.address);

  if (currentPlayer) {
    let currentVideo = new VideoActivity(
      entity.playerProfileId.toString() +
        entity.videoPubId.toString() +
        entity.videoProfileId.toString() +
        event.address.toHexString(),
    );

    currentVideo.playerProfileId = entity.playerProfileId;
    currentVideo.contractAddress = event.address;
    currentVideo.profileId = entity.videoProfileId;
    currentVideo.pubId = entity.videoPubId;
    // currentVideo.videosBytes = missionData.getPlayerVideoBytes();
    currentVideo.playCount = missionData.getPlayerVideoPlayCount(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.avd = missionData.getPlayerVideoAVD(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.duration = missionData.getPlayerVideoDuration(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.playerId = missionData.getVideoPlaybackId(
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.mostReplayedArea = missionData.getPlayerVideoMostReplayedArea(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.hasQuoted = missionData.getPlayerVideoQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.hasMirrored = missionData.getPlayerVideoMirror(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.hasBookmarked = missionData.getPlayerVideoBookmark(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.hasCommented = missionData.getPlayerVideoComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.hasReacted = missionData.getPlayerVideoReact(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.secondaryCollectOnComment = missionData.getPlayerVideoSecondaryCollectOnComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryMirrorOnComment = missionData.getPlayerVideoSecondaryMirrorOnComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryQuoteOnComment = missionData.getPlayerVideoSecondaryQuoteOnComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryReactOnComment = missionData.getPlayerVideoSecondaryReactOnComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryCommentOnComment = missionData.getPlayerVideoSecondaryCommentOnComment(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.secondaryCollectOnQuote = missionData.getPlayerVideoSecondaryCollectOnQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryMirrorOnQuote = missionData.getPlayerVideoSecondaryMirrorOnQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryQuoteOnQuote = missionData.getPlayerVideoSecondaryQuoteOnQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryReactOnQuote = missionData.getPlayerVideoSecondaryReactOnQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );
    currentVideo.secondaryCommentOnQuote = missionData.getPlayerVideoSecondaryCommentOnQuote(
      entity.playerProfileId,
      entity.videoPubId,
      entity.videoProfileId,
    );

    currentVideo.save();

    let videos: Array<string> | null = currentPlayer.videos;

    if (!videos) {
      videos = [];
    }
    videos.push(
      entity.playerProfileId.toString() +
        entity.videoPubId.toString() +
        entity.videoProfileId.toString() +
        event.address.toHexString(),
    );

    currentPlayer.videos = videos;

    currentPlayer.save();
  }

  entity.save();
}

export function handleMissionInstantiated(event: MissionInstantiatedEvent): void {
  let entity = new MissionInstantiated(
    event.params.missionId.toString() + event.address.toHexString(),
  );
  entity.missionId = event.params.missionId;
  entity.milestoneCount = event.params.milestoneCount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.contractAddress = event.address;

  let missionData = KleponMissionData.bind(event.address);

  entity.maxPlayerCount = missionData.getMissionMaxPlayerCount(entity.missionId);

  entity.profileId = missionData.getMissionProfileId(entity.missionId);
  entity.pubId = missionData.getMissionPubId(entity.missionId);

  entity.uri = missionData.getMissionURI(entity.missionId);
  entity.status = true;

  let rewardHash = "";

  if (entity.uri !== null) {
    let hash = entity.uri;

    if (hash.includes("ipfs://")) {
      hash = hash.split("/").pop();
    }
    if (hash !== null) {
      entity.missionMetadata = hash;
      MissionMetadataTemplate.create(hash);
    }

    rewardHash = hash;
  }

  let outerGate = new Gate(entity.uri.split("/").pop());

  const addressesErc20 = missionData.getMissionGatedERC20Addresses(entity.missionId);
  const thresholdsErc20 = missionData.getMissionGatedERC20Thresholds(
    entity.missionId,
  );

  let erc20Logic: Array<string> = [];
  let erc721Logic: Array<string> = [];

  for (let h = 0; h < addressesErc20.length; h++) {
    if (h < thresholdsErc20.length) {
      let erc20 = new ERC20Logic(
        entity.uri.split("/").pop() +
          entity.missionId.toString() +
          h.toString() +
          addressesErc20[h].toHexString() +
          entity.uri +
          event.address.toHexString(),
      );

      erc20.amount = thresholdsErc20[h];
      erc20.address = addressesErc20[h];
      erc20.contractAddress = event.address;
      erc20.save();

      erc20Logic.push(
        entity.uri.split("/").pop() +
          entity.missionId.toString() +
          h.toString() +
          addressesErc20[h].toHexString() +
          entity.uri +
          event.address.toHexString(),
      );
    }
  }

  const addressesErc721 = missionData.getMissionGatedERC721Addresses(
    entity.missionId,
  );
  let tokenIds = missionData.getMissionGatedERC721TokenIds(entity.missionId);
  let tokenURIs = missionData.getMissionGatedERC721TokenURIs(entity.missionId);

  if (!tokenIds) {
    tokenIds = [];
  }

  if (!tokenURIs) {
    tokenURIs = [];
  }

  for (let h = 0; h < addressesErc721.length; h++) {
    let erc721 = new ERC721Logic(
      entity.uri.split("/").pop() +
        entity.missionId.toString() +
        h.toString() +
        addressesErc721[h].toHexString() +
        entity.uri +
        event.address.toHexString(),
    );

    erc721.address = addressesErc721[h];

    if (h < tokenIds.length && tokenIds[h]) {
      erc721.tokenIds = tokenIds[h];
    }

    if (h < tokenURIs.length && tokenURIs[h]) {
      erc721.uris = tokenURIs[h];
    }
    erc721.contractAddress = event.address;
    erc721.save();
    erc721Logic.push(
      entity.uri.split("/").pop() +
        entity.missionId.toString() +
        h.toString() +
        addressesErc721[h].toHexString() +
        entity.uri +
        event.address.toHexString(),
    );
  }

  outerGate.erc20Logic = erc20Logic;
  outerGate.erc721Logic = erc721Logic;

  outerGate.oneOf = missionData.getMissionGatedOneOf(entity.missionId);
  outerGate.contractAddress = event.address;
  outerGate.save();

  entity.gate = entity.uri.split("/").pop();

  let milestones: Array<string> = [];

  for (let i = 0; i < entity.milestoneCount.toI32(); i++) {
    let milestoneCounter = BigInt.fromI32(i + 1);

    let milestoneURI = missionData.getMilestoneURI(
      entity.missionId,
      <BigInt>milestoneCounter,
    );
    if (milestoneURI.includes("ipfs://")) {
      milestoneURI = milestoneURI.split("/").pop();
    }
    let milestoneId =
      (i + 1 + entity.missionId.toI32()).toString() +
      milestoneURI +
      event.address.toHexString();

    let milestone = new Milestone(milestoneId);
    milestone.milestoneId = <BigInt>milestoneCounter;
    milestone.contractAddress = event.address;
    milestone.missionId = entity.missionId;

    if (milestoneURI !== null) {
      milestone.uri = milestoneURI;
      milestone.milestoneMetadata = milestoneURI;
      MissionMetadataTemplate.create(milestoneURI);
    }

    let gated = new Gate(
      milestoneURI + milestoneId + event.address.toHexString(),
    );

    const addressesErc20 = missionData.getMilestoneGatedERC20Addresses(
      entity.missionId,
      <BigInt>milestoneCounter,
    );
    const thresholdsErc20 = missionData.getMilestoneGatedERC20Thresholds(
      entity.missionId,
      <BigInt>milestoneCounter,
    );

    let erc20Logic: Array<string> = [];
    let erc721Logic: Array<string> = [];

    for (let h = 0; h < addressesErc20.length; h++) {
      let erc20 = new ERC20Logic(
        milestoneId +
          h.toString() +
          addressesErc20[h].toHexString() +
          milestoneURI +
          event.address.toHexString(),
      );
      erc20.contractAddress = event.address;
      erc20.amount = thresholdsErc20[h];
      erc20.address = addressesErc20[h];
      erc20.save();

      erc20Logic.push(
        milestoneId +
          h.toString() +
          addressesErc20[h].toHexString() +
          milestoneURI +
          event.address.toHexString(),
      );
    }

    const addressesErc721 = missionData.getMilestoneGatedERC721Addresses(
      entity.missionId,
      <BigInt>milestoneCounter,
    );
    let tokenIds = missionData.getMilestoneGatedERC721TokenIds(
      entity.missionId,
      <BigInt>milestoneCounter,
    );
    let tokenURIs = missionData.getMilestoneGatedERC721TokenURIs(
      entity.missionId,
      <BigInt>milestoneCounter,
    );

    if (!tokenIds) {
      tokenIds = [];
    }

    if (!tokenURIs) {
      tokenURIs = [];
    }

    for (let h = 0; h < addressesErc721.length; h++) {
      let erc721 = new ERC721Logic(
        milestoneId +
          h.toString() +
          addressesErc721[h].toHexString() +
          milestoneURI +
          event.address.toHexString(),
      );

      erc721.address = addressesErc721[h];

      if (h < tokenIds.length && tokenIds[h]) {
        erc721.tokenIds = tokenIds[h];
      }

      if (h < tokenURIs.length && tokenURIs[h]) {
        erc721.uris = tokenURIs[h];
      }
      erc721.contractAddress = event.address;
      erc721.save();
      erc721Logic.push(
        milestoneId +
          h.toString() +
          addressesErc721[h].toHexString() +
          milestoneURI +
          event.address.toHexString(),
      );
    }

    gated.erc20Logic = erc20Logic;
    gated.erc721Logic = erc721Logic;

    gated.oneOf = missionData.getMilestoneGatedOneOf(
      entity.missionId,
      <BigInt>milestoneCounter,
    );
    gated.contractAddress = event.address;
    gated.save();

    milestone.gated = milestoneURI + milestoneId + event.address.toHexString();
    milestone.videoLength = missionData.getMilestoneVideoLength(
      entity.missionId,
      <BigInt>milestoneCounter,
    );

    let videos: Array<string> = [];
    const allVideos = missionData.getMilestoneVideos(
      entity.missionId,
      <BigInt>milestoneCounter,
    );

    for (let j = 0; j < allVideos.length; j++) {
      let currentVideo = new Video(
        allVideos[j].toString() +
          entity.missionId.toString() +
          (<BigInt>milestoneCounter).toString() +
          event.address.toHexString(),
      );
      currentVideo.missionId = entity.missionId;
      currentVideo.contractAddress = event.address;
      currentVideo.pubId = BigInt.fromString(
        parseInt(allVideos[j].split("-")[1], 16)
          .toString()
          .replace(".0", ""),
      );
      currentVideo.profileId = BigInt.fromString(
        parseInt(allVideos[j].split("-")[0], 16)
          .toString()
          .replace(".0", ""),
      );

      if (<BigInt>currentVideo.pubId && <BigInt>currentVideo.profileId) {
        currentVideo.playerId = missionData.getVideoPlaybackId(
          <BigInt>currentVideo.pubId,
          <BigInt>currentVideo.profileId,
        );
        currentVideo.videoBytes = missionData.getVideoBytesFromPlaybackId(
          <string>currentVideo.playerId,
        );

        currentVideo.minPlayCount = missionData.getMilestoneVideoMinPlayCount(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minAVD = missionData.getMilestoneVideoMinAVD(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryQuoteOnQuote = missionData.getMilestoneVideoMinSecondaryQuoteOnQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryMirrorOnQuote = missionData.getMilestoneVideoMinSecondaryMirrorOnQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryReactOnQuote = missionData.getMilestoneVideoMinSecondaryReactOnQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryCommentOnQuote = missionData.getMilestoneVideoMinSecondaryCommentOnQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryCollectOnQuote = missionData.getMilestoneVideoMinSecondaryCollectOnQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryQuoteOnComment = missionData.getMilestoneVideoMinSecondaryQuoteOnComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryMirrorOnComment = missionData.getMilestoneVideoMinSecondaryMirrorOnComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryReactOnComment = missionData.getMilestoneVideoMinSecondaryReactOnComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryCommentOnComment = missionData.getMilestoneVideoMinSecondaryCommentOnComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minSecondaryCollectOnComment = missionData.getMilestoneVideoMinSecondaryCollectOnComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.minDuration = missionData.getMilestoneVideoMinDuration(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.quote = missionData.getMilestoneVideoQuote(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.mirror = missionData.getMilestoneVideoMirror(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.react = missionData.getMilestoneVideoReact(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.comment = missionData.getMilestoneVideoComment(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.bookmark = missionData.getMilestoneVideoBookmark(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );
        currentVideo.factoryIds = missionData.getMilestoneVideoFactoryIds(
          entity.missionId,
          <BigInt>milestoneCounter,
          <BigInt>currentVideo.profileId,
          <BigInt>currentVideo.pubId,
        );

        videos.push(
          allVideos[j].toString() +
            entity.missionId.toString() +
            (<BigInt>milestoneCounter).toString() +
            event.address.toHexString(),
        );
      }

      currentVideo.save();
    }

    let rewards: Array<string> = [];

    const rewardLength = missionData.getMilestoneRewardsLength(
      entity.missionId,
      <BigInt>milestoneCounter,
    );

    milestone.rewardsLength = rewardLength;

    for (let j = 0; j < rewardLength.toI32(); j++) {
      let currentReward = new Reward(
        milestoneURI + j.toString() + event.address.toHexString(),
      );

      currentReward.amount = missionData.getMilestoneRewardTokenAmount(
        entity.missionId,
        BigInt.fromI32(j),
        <BigInt>milestoneCounter,
      );
      currentReward.missionMetadata = rewardHash;
      currentReward.missionURI = entity.uri;
      currentReward.pubId = entity.pubId;
      currentReward.profileId = entity.profileId;
      currentReward.missionId = entity.missionId;
      currentReward.milestone = milestone.milestoneId;
      currentReward.tokenAddress = missionData.getMilestoneRewardTokenAddress(
        entity.missionId,
        BigInt.fromI32(j),
        <BigInt>milestoneCounter,
      );
      currentReward.type = BigInt.fromI32(
        missionData.getMilestoneRewardType(
          entity.missionId,
          BigInt.fromI32(j),
          <BigInt>milestoneCounter,
        ),
      );
      currentReward.uri = missionData.getMilestoneRewardURI(
        entity.missionId,
        BigInt.fromI32(j),
        <BigInt>milestoneCounter,
      );

      if (currentReward.uri) {
        const hash = (<string>currentReward.uri).split("/").pop();
        currentReward.rewardMetadata = hash;
        MissionMetadataTemplate.create(hash);
      }

      currentReward.contractAddress = event.address;
      currentReward.save();
      rewards.push(milestoneURI + j.toString() + event.address.toHexString());
    }

    milestone.rewards = rewards;
    milestone.videos = videos;

    milestone.save();
    milestones.push(milestoneId);
  }

  entity.milestones = milestones;

  entity.save();
}

export function handleMissionStatusUpdated(event: MissionStatusUpdatedEvent): void {
  let entity = new MissionStatusUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.missionId = event.params.missionId;
  entity.status = event.params.status;

  let mission = MissionInstantiated.load(
    event.params.missionId.toString() + event.address.toHexString(),
  );

  if (mission) {
    if (entity.status == 0) {
      mission.status = true;
    } else {
      mission.status = false;
    }

    mission.save();
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMissionDeleted(event: MissionDeletedEvent): void {
  let entity = new MissionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.missionId = event.params.missionId;

  let mission = MissionInstantiated.load(
    event.params.missionId.toString() + event.address.toHexString(),
  );

  if (mission) {
    store.remove("MissionMetadata", mission.uri);
    const gated = Gate.load(<string>mission.gate);
    if (gated) {
      let logic20: Array<string> | null = gated.erc20Logic;
      if (<Array<string>>logic20 && (<Array<string>>logic20).length > 0) {
        for (let h = 0; h < (<Array<string>>logic20).length; h++) {
          store.remove("ERC20Logic", (<Array<string>>logic20)[h]);
        }
      }
      let logic721: Array<string> | null = gated.erc721Logic;
      if (<Array<string>>logic721 && (<Array<string>>logic721).length > 0) {
        for (let h = 0; h < (<Array<string>>logic721).length; h++) {
          store.remove("ERC721Logic", (<Array<string>>logic721)[h]);
        }
      }
    }
    store.remove("Gate", <string>mission.gate);
    let allMilestones: Array<string> | null = mission.milestones;
    if (allMilestones) {
      for (let i = 0; i < mission.milestoneCount.toI32(); i++) {
        let milestoneId: string | null = (<Array<string>>allMilestones)[i];
        if (milestoneId) {
          let milestone = Milestone.load(<string>milestoneId);

          if (milestone) {
            const gated = Gate.load(<string>milestone.gated);
            if (gated) {
              let logic20: Array<string> | null = gated.erc20Logic;
              if (
                <Array<string>>logic20 &&
                (<Array<string>>logic20).length > 0
              ) {
                for (let h = 0; h < (<Array<string>>logic20).length; h++) {
                  store.remove("ERC20Logic", (<Array<string>>logic20)[h]);
                }
              }
              let logic721: Array<string> | null = gated.erc721Logic;
              if (
                <Array<string>>logic721 &&
                (<Array<string>>logic721).length > 0
              ) {
                for (let h = 0; h < (<Array<string>>logic721).length; h++) {
                  store.remove("ERC721Logic", (<Array<string>>logic721)[h]);
                }
              }
            }
            store.remove("Gate", <string>milestone.gated);
            store.remove("MissionMetadata", <string>milestone.uri);

            let rewards: Array<string> | null = milestone.rewards;
            if (rewards) {
              if (<BigInt | null>milestone.rewardsLength) {
                for (
                  let j = 0;
                  j < (<BigInt>milestone.rewardsLength).toI32();
                  j++
                ) {
                  store.remove("Reward", (<Array<string>>milestone.rewards)[j]);
                }
              }
            }

            let videos: Array<string> | null = milestone.videos;
            if (videos) {
              if (<BigInt | null>milestone.videoLength) {
                for (
                  let j = 0;
                  j < (<BigInt>milestone.videoLength).toI32();
                  j++
                ) {
                  store.remove("Video", (<Array<string>>milestone.videos)[j]);
                }
              }
            }
          }
          store.remove("Milestone", milestoneId);
        }
      }
    }
    store.remove(
      "MissionInstantiated",
      event.params.missionId.toString() + event.address.toHexString(),
    );
  }

  entity.contractAddress = event.address;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
