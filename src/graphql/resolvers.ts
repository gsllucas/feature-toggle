import { FeatureHelper } from '../helpers/feature.helper';
import { redisClient } from '../redis/client';
import { Feature } from './interfaces/feature';

const resolvers = {
  Query: {
    feature: async (_, args) => {
      const key = `feature:${args.feature}`;
      const cacheData = await redisClient.get(key);

      if (cacheData) {
        const parsedFeature = JSON.parse(cacheData) as Feature;
        const institutions = parsedFeature.institutions;
        return institutions.length === 0
          ? parsedFeature
          : {
              ...parsedFeature,
              available:
                parsedFeature.available &&
                FeatureHelper.getAvailabilityByInstitution(
                  institutions,
                  args.institutionId
                ),
            };
      }

      return null;
    },
    features: async (_, args) => {
      const keys: string[] = [];
      const features = [];
      let cursor = 0;

      do {
        const cacheScan = await redisClient.scan(cursor, {
          MATCH: 'feature:*',
        });
        cursor = cacheScan.cursor;
        keys.push(...cacheScan.keys);
      } while (cursor !== 0);

      for (const key of keys) {
        const feature = JSON.parse(await redisClient.get(key));
        features.push(feature);
      }

      if (args.filter) {
        const filteredFeatures = features.filter(
          ({ available }) => available === args.filter.available
        );
        return filteredFeatures;
      }

      return features;
    },
  },
  Mutation: {
    createFeature: async (_, args) => {
      const key = `feature:${args.input.feature}`;
      const feature = await redisClient.get(key);
      if (feature) throw new Error('Feature already exists');
      const dateAt = args.input.available ? 'availableAt' : 'disabledAt';
      const institutions = args.input.institutions ?? [];
      const value = { ...args.input, [dateAt]: new Date(), institutions };
      const cacheResponse = await redisClient.set(key, JSON.stringify(value));
      if (cacheResponse === 'OK') return value;
      return null;
    },
    updateFeature: async (_, args) => {
      const key = `feature:${args.input.feature}`;
      const available = args.input.available;
      const value = {
        ...args.input,
        availableAt: available ? new Date() : null,
        disabledAt: !available ? new Date() : null,
      };
      const cacheResponse = await redisClient.set(key, JSON.stringify(value));
      if (cacheResponse === 'OK') return value;
      return null;
    },
    removeFeature: async (_, args) => {
      const key = `feature:${args.feature}`;
      const cacheResponse = await redisClient.del(key);
      return cacheResponse !== 0;
    },
  },
};

export default resolvers;
