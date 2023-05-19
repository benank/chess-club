import type { Side } from './models';

export const getOtherSide = (side: Side): Side => {
	return side == 'w' ? 'b' : 'w';
};
