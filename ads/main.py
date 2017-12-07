# Copyright 2014 Facebook, Inc.
# Modified by Vivek Menon

from facebookads.adobjects.adaccount import AdAccount
from facebookads.adobjects.campaign import Campaign
from facebookads.adobjects.adset import AdSet
from facebookads.adobjects.adcreative import AdCreative
from facebookads.adobjects.ad import Ad
from facebookads.adobjects.adpreview import AdPreview
from facebookads.api import FacebookAdsApi

# Access Details
access_token = ''
ad_account_id = ''
app_secret = ''
page_id = ''
FacebookAdsApi.init(access_token=access_token)



campaign = AdAccount(ad_account_id).create_campaign(
    fields=[]],
    params={
    'name': 'My Campaign',
    'buying_type': 'AUCTION',
    'objective': 'PAGE_LIKES',
    'status': 'PAUSED',
},
)

print('campaign', campaign)

campaign_id = campaign.get_id()

print('campaign_id:', campaign_id, '\n')

fields = [
]
params = {
    'name': 'My AdSet',
    'optimization_goal': 'PAGE_LIKES',
    'billing_event': 'IMPRESSIONS',
    'bid_amount': '20',
    'promoted_object': {'page_id': page_id},
    'daily_budget': '1000',
    'campaign_id': campaign_id,
    'targeting': {'geo_locations': {'countries': ['US']}},
    'status': 'PAUSED',
}
ad_set = AdAccount(ad_account_id).create_ad_set(
    fields=fields,
    params=params,
)
print 'ad_set', ad_set

ad_set_id = ad_set.get_id()
print 'ad_set_id:', ad_set_id, '\n'

fields = [
]
params = {
    'name': 'My Creative',
    'object_id': page_id,
    'title': 'My Page Like Ad',
    'body': 'Like My Page',
    'image_url': 'http://www.facebookmarketingdevelopers.com/static/images/resource_1.jpg',
}
creative = AdAccount(ad_account_id).create_ad_creative(
    fields=fields,
    params=params,
)
print 'creative', creative

creative_id = creative.get_id()
print 'creative_id:', creative_id, '\n'

fields = [
]
params = {
    'name': 'My Ad',
    'adset_id': ad_set_id,
    'creative': {'creative_id': creative_id},
    'status': 'PAUSED',
}
ad = AdAccount(ad_account_id).create_ad(
    fields=fields,
    params=params,
)
print 'ad', ad

ad_id = ad.get_id()
print 'ad_id:', ad_id, '\n'

fields = [
]
params = {
    'ad_format': 'DESKTOP_FEED_STANDARD',
}
print Ad(ad_id).get_previews(
    fields=fields,
    params=params,
)
