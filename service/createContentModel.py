from scipy.spatial import distance
import pickle
from collections import defaultdict
import pandas as pd
import numpy as np

with open('pd_business.pkl', 'rb') as f:
    pd_business = pickle.load(f)

class ContentModel:
    def __init__(self, pd_business, ratio=[0.3, 0.1, 0.4, 0.2]):
        self.pd_business = pd_business
        self.ratio = ratio

    @staticmethod
    def cal_cos_sim(vec1, vec2):
        assert isinstance(vec1, list)
        assert isinstance(vec2, list)
        dis = distance.cosine(vec1, vec2)
        return 1 - dis

    @staticmethod
    def Jaccard(vec1, vec2):
        assert isinstance(vec1, list)
        assert isinstance(vec2, list)
        set1 = set(vec1)
        set2 = set(vec2)
        inter = len(set1.intersection(set2))
        uni = len(set1.union(set2))
        return inter / uni

    def makeRecomm(self, resId, top_N=5):
        simList = list()
        for index, row in self.pd_business.iterrows():
            if resId != index:
                sim_cat = self.ratio[0] * ContentModel.Jaccard(
                    self.pd_business.loc[resId, 'Restaurant_categories'], self.pd_business.loc[index, 'Restaurant_categories'])
                sim_attr = self.ratio[1] * ContentModel.Jaccard(
                    self.pd_business.loc[resId, 'attributes_list'], self.pd_business.loc[index, 'attributes_list'])
                sim_loc = self.ratio[2] * ContentModel.Jaccard(
                    self.pd_business.loc[resId, 'location'], self.pd_business.loc[index, 'location'])
                sim_rate = self.ratio[3] * ContentModel.cal_cos_sim(
                    self.pd_business.loc[resId, 'rate_vec'], self.pd_business.loc[index, 'rate_vec'])
                simList.append((index, sim_cat+sim_attr+sim_loc+sim_rate))

        simList.sort(key=lambda tp: tp[1], reverse=True)

        return [tp[0] for tp in simList[:top_N]]


if __name__ == '__main__':
    contentModel = ContentModel(pd_business)
    with open('contentModel.pkl', 'wb') as f:
        pickle.dump(contentModel, f, pickle.HIGHEST_PROTOCOL)
    del contentModel

    with open('contentModel.pkl', 'rb') as f:
        contentModel = pickle.load(f)
    top_N_recomm = contentModel.makeRecomm('gnKjwL_1w79qoiV3IC_xQQ')
    print(top_N_recomm)

    for r in top_N_recomm:
        print('Restaurant id: {}'.format(pd_business.loc[r].name))
        print('Food categories: {}'.format(pd_business.loc[r, 'Restaurant_categories']))
        print('Attributes: {}'.format(pd_business.loc[r, 'attributes_list']))
        print('Location: {}'.format(pd_business.loc[r, 'location']))
        print('Rate, # of rates: {}'.format(pd_business.loc[r, 'rate_vec']))
        print("=====================================================================")
