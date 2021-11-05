import { ZeroOneToYesNoPipe } from './zero-one-to-yes-no.pipe';

describe('ZeroOneToYesNoPipe', () => {
  it('create an instance', () => {
    const pipe = new ZeroOneToYesNoPipe();
    expect(pipe).toBeTruthy();
  });
});
