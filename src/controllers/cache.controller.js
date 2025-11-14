import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { cacheService } from '../services/cache.service.js';


export const cacheController = {
  getStats: asyncHandler((_req, res) => {
    const stats = cacheService.getStats();
    sendSuccess(res, stats, 'Stats retrieved successfully');
  }),
}