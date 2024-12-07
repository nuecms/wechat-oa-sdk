import { sdkBuilder, SdkBuilder, SdkBuilderConfig, RedisCacheProvider, CacheProvider } from '@nuecms/sdk-builder';

interface WeChatSDKConfig {
  appId: string;
  appSecret: string;
  baseUrl?: string;
  cacheProvider: CacheProvider;
}

export {
  RedisCacheProvider,
  type CacheProvider,
  type WeChatSDKConfig,
}

export function wxSdk(config: WeChatSDKConfig): SdkBuilder {
  const sdkConfig: SdkBuilderConfig = {
    baseUrl: config.baseUrl || 'https://api.weixin.qq.com',
    cacheProvider: config.cacheProvider,
    placeholders: {
      access_token: '{access_token}',
    },
    config: {
      appId: config.appId,
      appSecret: config.appSecret,
    },
  };

  const sdk: ReturnType<typeof sdkBuilder> = sdkBuilder(sdkConfig);

  // # User Management
  sdk.r('getUserInfo', '/cgi-bin/user/info', 'GET');
  sdk.r('batchGetUserInfo', '/cgi-bin/user/info/batchget', 'POST');
  sdk.r('getUserList', '/cgi-bin/user/get', 'GET');
  sdk.r('getBlacklist', '/cgi-bin/tags/members/getblacklist', 'GET');

  // # Tag Management
  sdk.r('createTag', '/cgi-bin/tags/create', 'POST');
  sdk.r('getTags', '/cgi-bin/tags/get', 'GET');
  sdk.r('updateTag', '/cgi-bin/tags/update', 'POST');
  sdk.r('deleteTag', '/cgi-bin/tags/delete', 'POST');
  sdk.r('tagUser', '/cgi-bin/tags/members/batchtagging', 'POST');
  sdk.r('untagUser', '/cgi-bin/tags/members/batchuntagging', 'POST');

  // # Custom Menu Management
  sdk.r('createMenu', '/cgi-bin/menu/create', 'POST');
  sdk.r('getMenu', '/cgi-bin/menu/get', 'GET');
  sdk.r('deleteMenu', '/cgi-bin/menu/delete', 'GET');
  sdk.r('addConditionalMenu', '/cgi-bin/menu/addconditional', 'POST');
  sdk.r('deleteConditionalMenu', '/cgi-bin/menu/delconditional', 'POST');
  sdk.r('tryMatchMenu', '/cgi-bin/menu/trymatch', 'POST');

  // # Message Management
  // ## Template Messages
  sdk.r('sendTemplateMessage', '/cgi-bin/message/template/send', 'POST');
  sdk.r('setIndustry', '/cgi-bin/template/api_set_industry', 'POST');
  sdk.r('getIndustry', '/cgi-bin/template/get_industry', 'GET');
  sdk.r('addTemplate', '/cgi-bin/template/api_add_template', 'POST');
  sdk.r('getTemplateList', '/cgi-bin/template/get_all_private_template', 'GET');
  sdk.r('deleteTemplate', '/cgi-bin/template/del_private_template', 'POST');

  // ## Custom Messages
  sdk.r('sendCustomMessage', '/cgi-bin/message/custom/send', 'POST');
  sdk.r('getKfAccountList', '/cgi-bin/customservice/getkflist', 'GET');
  sdk.r('addKfAccount', '/cgi-bin/customservice/addkfaccount', 'POST');
  sdk.r('updateKfAccount', '/cgi-bin/customservice/updatekfaccount', 'POST');
  sdk.r('deleteKfAccount', '/cgi-bin/customservice/delkfaccount', 'POST');

  // ## Mass Messages
  sdk.r('sendMassMessage', '/cgi-bin/message/mass/send', 'POST');
  sdk.r('deleteMassMessage', '/cgi-bin/message/mass/delete', 'POST');
  sdk.r('previewMassMessage', '/cgi-bin/message/mass/preview', 'POST');

  // # Media Management
  sdk.r('uploadMedia', '/cgi-bin/media/upload', 'POST'); // Temporary media
  sdk.r('getMedia', '/cgi-bin/media/get', 'GET');
  sdk.r('uploadNews', '/cgi-bin/material/add_news', 'POST'); // Permanent media
  sdk.r('getMaterial', '/cgi-bin/material/get_material', 'GET');
  sdk.r('deleteMaterial', '/cgi-bin/material/del_material', 'POST');
  sdk.r('getMaterialList', '/cgi-bin/material/batchget_material', 'POST');

  // # OAuth2 Authentication
  sdk.r('getOAuthAccessToken', '/sns/oauth2/access_token', 'GET');
  sdk.r('refreshOAuthAccessToken', '/sns/oauth2/refresh_token', 'GET');
  sdk.r('getOAuthUserInfo', '/sns/userinfo', 'GET');

  // # Data Analytics
  sdk.r('getUserSummary', '/cgi-bin/datacube/getusersummary', 'POST');
  sdk.r('getUserCumulate', '/cgi-bin/datacube/getusercumulate', 'POST');
  sdk.r('getArticleSummary', '/cgi-bin/datacube/getarticlesummary', 'POST');
  sdk.r('getArticleTotal', '/cgi-bin/datacube/getarticletotal', 'POST');
  sdk.r('getArticleRead', '/cgi-bin/datacube/getuserread', 'POST');
  sdk.r('getArticleShare', '/cgi-bin/datacube/getusershare', 'POST');

  // # URL Shortening
  sdk.r('shorturl', '/cgi-bin/shorturl', 'POST');

  // # Account Management
  sdk.r('createQrcode', '/cgi-bin/qrcode/create', 'POST');
  sdk.r('getQrcode', '/cgi-bin/showqrcode', 'GET');
  sdk.r('addWhitelist', '/cgi-bin/template/api_add_to_template', 'POST');

  // # Access Token Management
  sdk.r('getAccessToken', '/cgi-bin/token', 'GET');
  sdk.r('clearQuota', '/cgi-bin/clear_quota', 'POST');

  // Register the auth method
  sdk.r('authenticate', async (config) => {
    const appId = config.appId;
    const appSecret = config.appSecret
    const cacheKey = `wechat_access_token_${appId}`;
    const cached = await sdk.cacheProvider?.get(cacheKey);
    if (cached) {
      return cached;
    }
    const response = await sdk.getAccessToken({ appid: appId, secret: appSecret, grant_type: 'client_credential' });
    // const accessToken = response.access_token;
    const expiresIn = response.expires_in || 7200;
    await sdk.cacheProvider?.set(cacheKey, response, 'json', expiresIn);
    return {
      access_token: response.access_token,
    };
  })

  return sdk;
}

