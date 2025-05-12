import { CategoryMap } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const categoryClassMap: CategoryMap = {
	другое: 'other',
	'софт-скил': 'soft',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};
