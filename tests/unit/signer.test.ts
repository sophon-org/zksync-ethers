import * as chai from 'chai';
import '../custom-matchers';
import {utils, EIP712Signer} from '../../src';
import {ethers, BigNumber} from 'ethers';

const {expect} = chai;

describe('EIP712Signer', () => {
  const ADDRESS = '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049';
  const RECEIVER = '0xa61464658AfeAf65CccaaFD3a512b69A83B77618';

  describe('#getSignInput()', () => {
    it('should return a populated transaction', async () => {
      const tx = {
        txType: utils.EIP712_TX_TYPE,
        from: ADDRESS,
        to: RECEIVER,
        gasLimit: BigNumber.from(21_000),
        gasPerPubdataByteLimit: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        maxFeePerGas: BigNumber.from(250_000_000),
        maxPriorityFeePerGas: BigNumber.from(250_000_000),
        paymaster: ethers.constants.AddressZero,
        nonce: 0,
        value: BigNumber.from(7_000_000),
        data: '0x',
        factoryDeps: [],
        paymasterInput: '0x',
      };

      const result = EIP712Signer.getSignInput({
        type: utils.EIP712_TX_TYPE,
        to: RECEIVER,
        value: BigNumber.from(7_000_000),
        from: ADDRESS,
        nonce: 0,
        chainId: 270,
        gasPrice: BigNumber.from(250_000_000),
        gasLimit: BigNumber.from(21_000),
        customData: {},
      });
      expect(result).to.be.deep.equal(tx);
    });

    it('should return a populated transaction with default values', async () => {
      const tx = {
        txType: utils.EIP712_TX_TYPE,
        from: ADDRESS,
        to: RECEIVER,
        gasLimit: 0,
        gasPerPubdataByteLimit: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        paymaster: ethers.constants.AddressZero,
        nonce: 0,
        value: 0,
        data: '0x',
        factoryDeps: [],
        paymasterInput: '0x',
      };

      const result = EIP712Signer.getSignInput({
        type: utils.EIP712_TX_TYPE,
        to: RECEIVER,
        from: ADDRESS,
      });
      expect(result).to.be.deep.equal(tx);
    });
  });

  describe('#getSignedDigest()', () => {
    it('should throw an error when chain ID is not specified', async () => {
      try {
        EIP712Signer.getSignedDigest({});
      } catch (e) {
        expect((e as Error).message).to.be.equal(
          "Transaction chainId isn't set!"
        );
      }
    });
  });
});
