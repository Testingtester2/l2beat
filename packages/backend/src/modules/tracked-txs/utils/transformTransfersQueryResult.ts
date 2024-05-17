import { assert } from '@l2beat/shared-pure'

import { TrackedTxTransferConfig } from '../types/TrackedTxsConfig'
import { BigQueryTransferResult, TrackedTxTransferResult } from '../types/model'

export function transformTransfersQueryResult(
  configs: TrackedTxTransferConfig[],
  queryResults: BigQueryTransferResult[],
): TrackedTxTransferResult[] {
  return queryResults.flatMap((r) => {
    const matchingConfigs = configs.filter(
      (t) => t.from === r.from_address && t.to === r.to_address,
    )

    assert(
      matchingConfigs.length > 0,
      'There should be at least one matching config',
    )

    return matchingConfigs.flatMap((matchingConfig) =>
      matchingConfig.uses.map(
        (use) =>
          ({
            type: 'transfer',
            projectId: matchingConfig.projectId,
            use,
            hash: r.hash,
            blockNumber: r.block_number,
            blockTimestamp: r.block_timestamp,
            fromAddress: r.from_address,
            toAddress: r.to_address,
            receiptGasUsed: r.receipt_gas_used,
            gasPrice: r.gas_price,
            dataLength: r.data_length,
            calldataGasUsed: r.calldata_gas_used,
            receiptBlobGasUsed: r.receipt_blob_gas_used,
            receiptBlobGasPrice: r.receipt_blob_gas_price,
          }) as const,
      ),
    )
  })
}
