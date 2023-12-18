利多码平台开放接口
## 接口说明

### 开发文档阅读说明

本文档为利多码平台开放接口文档，开发者可以借助接口实现与利多码平台服务集成。

文档的阅读次序建议先阅读开始开发及接口 access_token 获取。然后就可以独立查看各个功能块文档说明。

所有的接口需使用 HTTPS 协议、JSON 数据格式、UTF8 编码。

接口说明格式如下：

```
请求示例：
    GET/POST（HTTPS）
    https://api.lifanli.cn/oauth/token?client_id=ID&client_secret=SECRET&grant_type=client_credentials
参数说明：
...
返回说明：
...
```

1）**请求示例：** 请求示例中说明接口调用的 HTTP 方法，所有的请求均为 HTTPS 协议。

请求地址中标注的**大写单词**，表示为要**替换的变量**。在上面的例子中 ID 及 SECRET 为需要替换的变量，根据实际获取值更新。
假如，这里我们获取到的ID=13cfe2f52c4c25301554aa3a4a0a8522dba29f393db8c72b34971dd48a10f6d1，SECRET=72b3eaf116191182a5c8572a3d3cf19093fea49e70447763d740997ac6d2c228，那么上述的请求在发送时为：

```
https://api.lifanli.cn/oauth/token?client_id=13cfe2f52c4c25301554aa3a4a0a8522dba29f393db8c72b34971dd48a10f6d1&client_secret=72b3eaf116191182a5c8572a3d3cf19093fea49e70447763d740997ac6d2c228&grant_type=client_credentials
```

2）**参数说明：** 包括字段名称、字段类型、字段含义，开发者应参考参数定义。
3）**返回说明：** 包含正确、错误的返回示例以及返回的字段说明。除推送事件和 access_token 获取外所有接口返回包里都有 errcode、errmsg。开发者需根据 **errcode 存在且不为 0 判断为失败，否则为成功**（errcode 意义请见全局错误码）。而 errmsg 仅作参考，后续可能会有变动，因此不可作为是否调用成功的判据。

### 接口调用流程

1）获取 access_token，参考接口「1.1 获取 access_token」。
2）缓存和刷新 access_token。

开发者需要缓存 access_token，用于后续接口的调用（注意：不能频繁调用获取 access_token 接口，否则会受到频率拦截）。当access_token失效或过期时，需要重新获取。

3）调用具体的业务接口。

### 调用频率限制

当获取到 access_token 时，企业应用就可以成功调用利多码平台所提供的各种接口以管理或访问利多码平台的资源。

为了防止企业应用的程序错误而引发利多码平台服务器负载异常，默认情况下，每个调用接口都有一定的频率限制，当超过此限制时，调用对应接口会收到相应错误码。

以下是当前默认的频率限制，利多码平台可能会根据运营情况调整此阈值：

基础频率

* 每应用调用单个 api 不可超过 10次/秒，100次/分钟，1000次/小时

### 请求接口统一返回格式示例

```
# 超出限制 JSON 返回示例
{
    "errcode": 429,
    "errmsg": "Throttled, please try after 12 seconds\n请求过于频繁，请在 12 秒之后重试"
}
# 正确的 JSON 返回示例
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        # 根据不同请求，返回相应数据格式
    }
}
# 错误的 JSON 返回示例
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 推送事件统一推送格式示例

```
{
    "data_type": "award_order", # 推送事件不同，data_type 不同
    "data": {
        # 根据不同推送事件，推送相应数据格式
    }
}
```

### errcode 全局错误码

企业应用每次调用接口时，可能获得正确或错误的返回码，企业可以根据返回码信息调试接口，排查错误。
**注意：开发者的程序应该根据 errcode 来判断出错的情况，而不应该依赖 errmsg 来匹配，因为 errmsg 可能会调整。**

全局返回码说明如下：

| 错误码（errcode） | 错误说明 | 排查方法 |
| --- | --- | --- |
| 0 | 请求成功 | 接口调用成功 |
| 1 | 未明确分类的错误码 | 未在下列明确分类中的错误码统一返回 1，可参考 errmsg 提示排查错误 |
| 401 | 不合法的 secret 或 access_token | secret 参数可在「系统管理-API 设置」中查看 |
| 404 | 未找到资源 | 请求 api 路由不正确或传入的唯一标识（如 ID）不存在 |
| 422 | 参数缺失或验证不通过 | 不满足 api 参数要求或参数不合法 |

## 1. 开始开发

### 1.1 获取 access_token

access_token 是企业访问利多码平台开放接⼝的全局唯⼀凭证，调⽤接⼝时需携带 access_token。
正常情况下 access_token 有效期为 7200 秒，有效期内重复获取返回相同结果。

#### 请求示例

请将 client_id 和 client_secret 替换为您在利多码平台的 client_id 和 client_secret。

* HTTPS POST 请求

`https://api.lifanli.cn/oauth/token?client_id=ID&client_secret=SECRET&grant_type=client_credentials`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| client_id | String | 是 | 应用 id，登录利多码平台，在「系统管理-API 设置」 中获取 |
| client_secret | String | 是 | 应用密钥，登录利多码平台，在「系统管理-API 设置」 中获取 |
| grant_type | String | 是 | 获取 access_token 填写 client_credentials

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| access_token | String | 获取到的凭证 |
| token_type | String | 凭证类型 |
| expires_in | Integer | 有效时长 |
| created_at | Integer | 创建时间 |

1）参数正确时 JSON 返回示例

```
{
    "access_token": "eb0134045460871d433ea102b44992c829ea09a5a3689508bc8315c11a92bfa0",
    "token_type": "bearer",
    "expires_in": 5972,
    "created_at": 1510816690
}
```

2）参数错误时 JSON 返回示例

```
{
    "error": "invalid_client",
    "error_description": "Client authentication failed due to unknown client, no client authentication included, o r unsupported authentication method."
}
```

**注意事项：**

开发者需要缓存 access_token，用于后续接口的调用（注意：不能频繁调用 `oauth/token` 接口，否则会受到频率拦截）。
当 access_token 失效或过期时，需要重新获取。

access_token 的有效期通过返回的 expires_in 来传达，正常情况下为 7200 秒（2小时），有效期内重复获取返回相同结果，过期后获取会返回新的 access_token。

由于每个应用的 access_token 是彼此独立的，所以进行缓存时需要区分应用来进行存储。access_token 至少保留512字节的存储空间。

利多码平台可能会出于运营需要，提前使 access_token 失效，开发者应实现 access_token 失效时重新获取的逻辑。

## 2. 推送事件

### 2.1 兑奖订单信息推送

登录利多码平台，在「系统管理-API 设置」中设置推送地址，利多码平台将在兑奖完成后触发「兑奖订单信息推送事件」。
目前推送事件 data_type 定义为 `award_order`, data 中包含订单信息的编号，详细请参考 JSON 示例。数据推送后，需返回 `success`字符串，否则重新进行推送，总共推送三次。

#### 推送数据说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data_type |String | 推送数据类型，当前类型为 award_order |
| data | Hash | 推送数据内容，当前内容为用户数据 |

1）推送 JSON 示例

```
{
    "data_type": "award_order",
    "data": {
        "number": "3154090292"
    }
}
```

## 3. 用户接口

### 3.1 用户列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/users?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| users | Array | 用户列表数组 |
| &emsp;&emsp;id | String | 用户 ID |
| &emsp;&emsp;name | String | 姓名 |
| &emsp;&emsp;nickname | String | 昵称 |
| &emsp;&emsp;gender | String | 性别，<br/>female 女<br/>male 男<br/>unknown 未知 |
| &emsp;&emsp;avatar | String | 头像地址<br/>avatar_small_missing.jpg 默认头像 |
| &emsp;&emsp;points_balance | Integer | 积分 |
| &emsp;&emsp;cash_balance | Decimal | 零钱 |
| &emsp;&emsp;blocked | Boolean | 黑名单用户 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "users": [
            {
                "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
                "name": "张三",
                "phone": "13717840000",
                "nickname": "昵称1",
                "gender": "female",
                "avatar": "http://thirdwx.qlogo.cn/mmopen/vi_32/mUPPRQgl36xdiausf99ukL6b1s9z9n5VWk5ciby2vACPHvceGAV3lIMmy3TmQ13WKeyTmlJxOQG47XoZJ0uoKSQQ/132",
                "points_balance": 9900,
                "cash_balance": "5.0",
                "blocked": false
            },
            {
                "id": "Y27bdAxKVo8w6e4YWQRpZWmkMnJXlPgE",
                "name": null,
                "phone": null,
                "nickname": "昵称2",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 90,
                "cash_balance": "5.0",
                "blocked": false
            },
            {
                "id": "WGJ6jMd5YxNlRZve67kARe0akBPn9XpQ",
                "name": "李四",
                "phone": "13745640000",
                "nickname": "昵称3",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": true
            }
        ],
        "total_count": 3,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 3.2 获取用户详情

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/users/ID?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID  |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 用户 ID |
| name | String | 姓名 |
| nickname | String | 昵称 |
| gender | String | 性别，<br/>female 女<br/>male 男<br/>unknown 未知 |
| avatar | String | 头像地址，<br/>avatar_small_missing.jpg 默认头像] |
| points_balance | Integer | 积分 |
| cash_balance | Decimal | 零钱 |
| blocked | Boolean | 黑名单用户 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
        "name": "张三",
        "phone": "13717840000",
        "nickname": "昵称1",
        "gender": "female",
        "avatar": "http://thirdwx.qlogo.cn/mmopen/vi_32/mUPPRQgl36xdiausf99ukL6b1s9z9n5VWk5ciby2vACPHvceGAV3lIMmy3TmQ13WKeyTmlJxOQG47XoZJ0uoKSQQ/132",
        "points_balance": 9900,
        "cash_balance": "5.0",
        "blocked": false
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 3.3 更新用户信息

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/users/ID?access_token=TOKEN`

请求包体：

```
{
    "name": "test",
    "phone": "18300000000"
}
```

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID |
| name | String | 否 | 用户姓名 |
| phone | String | 否 | 用户手机号 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 用户 ID |
| name | String | 姓名 |
| nickname | String | 昵称 |
| gender | String | 性别，<br/>female 女<br/>male 男<br/>unknown 未知 |
| avatar | String | 头像地址，<br/>avatar_small_missing.jpg 默认头像] |
| points_balance | Integer | 积分 |
| cash_balance | Decimal | 零钱 |
| blocked | Boolean | 黑名单用户 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
        "name": "ww",
        "phone": "13717840000",
        "nickname": "昵称1",
        "gender": "female",
        "avatar": "http://thirdwx.qlogo.cn/mmopen/vi_32/mUPPRQgl36xdiausf99ukL6b1s9z9n5VWk5ciby2vACPHvceGAV3lIMmy3TmQ13WKeyTmlJxOQG47XoZJ0uoKSQQ/132",
        "points_balance": 9900,
        "cash_balance": "5.0",
        "blocked": false
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 3.4 黑名单列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/users/blocked?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| users | Array | 用户列表数组 |
| &emsp;&emsp;id | String | 用户 ID |
| &emsp;&emsp;name | String | 姓名 |
| &emsp;&emsp;nickname | String | 昵称 |
| &emsp;&emsp;gender | String | 性别，<br/>female 女<br/>male 男<br/>unknown 未知 |
| &emsp;&emsp;avatar | String | 头像地址<br/>avatar_small_missing.jpg 默认头像 |
| &emsp;&emsp;points_balance | Integer | 积分 |
| &emsp;&emsp;cash_balance | Decimal | 零钱 |
| &emsp;&emsp;blocked | Boolean | 黑名单用户 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "users": [
            {
                "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
                "name": "张三",
                "phone": "13717840000",
                "nickname": "昵称1",
                "gender": "female",
                "avatar": "http://thirdwx.qlogo.cn/mmopen/vi_32/mUPPRQgl36xdiausf99ukL6b1s9z9n5VWk5ciby2vACPHvceGAV3lIMmy3TmQ13WKeyTmlJxOQG47XoZJ0uoKSQQ/132",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": true
            },
            {
                "id": "Y27bdAxKVo8w6e4YWQRpZWmkMnJXlPgE",
                "name": null,
                "phone": null,
                "nickname": "昵称2",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": true
            },
            {
                "id": "WGJ6jMd5YxNlRZve67kARe0akBPn9XpQ",
                "name": "李四",
                "phone": "13745640000",
                "nickname": "昵称3",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": true
            }
        ],
        "total_count": 3,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 3.5 用户拉黑

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/users/ID/block?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "updated"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 3.6 用户取消拉黑

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/users/ID/unblock?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "updated"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

## 4. 用户标签接口

### 4.1 用户标签列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/user_tags?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| user_tags | Array | 用户标签列表数组 |
| &emsp;&emsp;id | String | 用户标签 ID |
| &emsp;&emsp;name | String | 用户标签名称 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "user_tags": [
            {
                "id": "29EjwNPXbeBkxab3zRQ650DZ1nog4JRG",
                "name": "用户标签1"
            },
            {
                "id": "BqdlE4gM2oD01WqnRka8OX5V96ZRrkmK",
                "name": "用户标签2"
            },
            {
                "id": "vAKRxnYGdmoPyWzDlRQMO47pgjqEX2Vb",
                "name": "用户标签3"
            }
        ],
        "total_count": 3,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 4.2 创建用户标签

#### 请求示例

* HTTPS POST 请求

`https://api.lifanli.cn/api/open_v1/user_tags?access_token=TOKEN`

请求包体：

```
{
    "name": "用户标签1"
}
```

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| name | String | 否 | 用户标签名称 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 用户标签ID |
| name | String | 用户标签名称 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "vAKRxnYGdmoPyWzDlRQMO47pgjqEX2Vb",
        "name": "用户标签1"
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 422,
    "errmsg": "验证失败: 标签名称已经被使用"
}
```

### 4.3 更新用户标签

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/user_tags/ID?access_token=TOKEN`

请求包体：

```
{
    "name": "新用户标签1"
}
```

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户标签 ID，请求地址中包含此 ID  |
| name | String | 否 | 用户标签名称 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 用户标签ID |
| name | String | 用户标签名称 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "vAKRxnYGdmoPyWzDlRQMO47pgjqEX2Vb",
        "name": "新用户标签1"
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 422,
    "errmsg": "验证失败: 标签名称已经被使用"
}
```

### 4.4 删除用户标签

#### 请求示例

* HTTPS DELETE 请求

`https://api.lifanli.cn/api/open_v1/user_tags/ID?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户标签 ID，请求地址中包含此 ID  |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "destroyed"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 422,
    "errmsg": "验证失败: 由于 注册设置 需要此记录，所以无法移除记录"
}
```

### 4.5 标签下用户列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/user_tags/ID/users?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户标签 ID，请求地址中包含此 ID  |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| users | Array | 标签下用户列表 |
| &emsp;&emsp;id | String | 用户 ID |
| &emsp;&emsp;name | String | 姓名 |
| &emsp;&emsp;nickname | String | 昵称 |
| &emsp;&emsp;gender | String | 性别，<br/>female 女<br/>male 男<br/>unknown 未知 |
| &emsp;&emsp;avatar | String | 头像地址<br/>avatar_small_missing.jpg 默认头像 |
| &emsp;&emsp;points_balance | Integer | 积分 |
| &emsp;&emsp;cash_balance | Decimal | 零钱 |
| &emsp;&emsp;blocked | Boolean | 黑名单用户 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "users": [
            {
                "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
                "name": "张三",
                "phone": "13745640000",
                "nickname": "昵称1",
                "gender": "female",
                "avatar": "http://thirdwx.qlogo.cn/mmopen/vi_32/mUPPRQgl36xdiausf99ukL6b1s9z9n5VWk5ciby2vACPHvceGAV3lIMmy3TmQ13WKeyTmlJxOQG47XoZJ0uoKSQQ/132",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": false
            },
            {
                "id": "WOkyjvaqn9J34GxdjOXQrP7Gd16QxbK2",
                "name": "ceshi",
                "phone": "13745640000",
                "nickname": "昵称2",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": false
            },
            {
                "id": "WGJ6jMd5YxNlRZve67kARe0akBPn9XpQ",
                "name": "小红",
                "phone": "13745612356",
                "nickname": "昵称3",
                "gender": "unknown",
                "avatar": "avatar_small_missing.jpg",
                "points_balance": 990,
                "cash_balance": "5.0",
                "blocked": false
            }
        ],
        "total_count": 3,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 4.6 用户增加标签

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/users/ID/tags?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID  |
| tag_ids | Array[String] | 是 | 标签 ID 数组 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "updated"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 4.7 用户移除标签

#### 请求示例

* HTTPS DELETE 请求

`https://api.lifanli.cn/api/open_v1/users/ID/tags?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 用户 ID，请求地址中包含此 ID  |
| tag_ids | Array[String] | 是 | 标签 ID 数组 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "destroyed"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

## 5. 渠道接口

### 5.1 渠道列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/channels?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| parent_id | String | 否 | 父渠道 ID<br/>传入此参数，则返回该父渠道下子渠道列表;<br/>不传入，则返回总部渠道列表 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| channels | Array | 渠道列表数组 |
| &emsp;&emsp;id | String | 渠道 ID |
| &emsp;&emsp;parent_id | String | 父渠道 ID |
| &emsp;&emsp;name | String | 渠道名称 |
| &emsp;&emsp;code | String | 渠道代码 |
| &emsp;&emsp;state | String | 状态，<br/>active 已激活<br/>unactive 未激活 |
| &emsp;&emsp;type | String | 渠道类型，<br/>Channels::Level0 总部<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| &emsp;&emsp;contact | String | 联系人 |
| &emsp;&emsp;phone | String | 联系电话 |
| &emsp;&emsp;province | String | 省代码 |
| &emsp;&emsp;city | String | 市代码 |
| &emsp;&emsp;district | String | 区代码 |
| &emsp;&emsp;addr | String | 详细地址 |
| &emsp;&emsp;note | String | 备注 |
| &emsp;&emsp;custom_field_values | Array | 自定义字段填写的值 |
| &emsp;&emsp;&emsp;&emsp;id | String | 自定义字段值对象 ID |
| &emsp;&emsp;&emsp;&emsp;custom_field_id | String | 自定义字段 ID |
| &emsp;&emsp;&emsp;&emsp;custom_field_label | String | 自定义字段名称 |
| &emsp;&emsp;&emsp;&emsp;value | String | 自定义字段值内容 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "channels": [
            {
                "id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
                "parent_id": null,
                "name": "总部",
                "code": "zb",
                "state": "active",
                "type": "Channels::Level0",
                "contact": "野芭蕉",
                "phone": "13812344321",
                "province": "",
                "city": "",
                "district": "",
                "addr": null,
                "note": null,
                "custom_field_values": [
                    {
                        "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk",
                        "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
                        "custom_field_label": "姓名",
                        "value": "xxxx11"
                    },
                    {
                        "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
                        "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
                        "custom_field_label": "来源",
                        "value": "A，B"
                    },
                    {
                        "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
                        "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
                        "custom_field_label": "性别",
                        "value": "A"
                    }
                ]
            }
        ],
        "total_count": 1,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 5.2 渠道列表(非树形)

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/channels/list?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| channels | Array | 渠道列表数组 |
| &emsp;&emsp;id | String | 渠道 ID |
| &emsp;&emsp;parent_id | String | 父渠道 ID |
| &emsp;&emsp;name | String | 渠道名称 |
| &emsp;&emsp;code | String | 渠道代码 |
| &emsp;&emsp;state | String | 状态，<br/>active 已激活<br/>unactive 未激活 |
| &emsp;&emsp;type | String | 渠道类型，<br/>Channels::Level0 总部<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| &emsp;&emsp;contact | String | 联系人 |
| &emsp;&emsp;phone | String | 联系电话 |
| &emsp;&emsp;province | String | 省代码 |
| &emsp;&emsp;city | String | 市代码 |
| &emsp;&emsp;district | String | 区代码 |
| &emsp;&emsp;addr | String | 详细地址 |
| &emsp;&emsp;note | String | 备注 |
| &emsp;&emsp;custom_field_values | Array | 自定义字段填写的值 |
| &emsp;&emsp;&emsp;&emsp;id | String | 自定义字段值对象 ID |
| &emsp;&emsp;&emsp;&emsp;custom_field_id | String | 自定义字段 ID |
| &emsp;&emsp;&emsp;&emsp;custom_field_label | String | 自定义字段名称 |
| &emsp;&emsp;&emsp;&emsp;value | String | 自定义字段值内容 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "channels": [
            {
                "id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
                "parent_id": null,
                "name": "总部",
                "code": "zb",
                "state": "active",
                "type": "Channels::Level0",
                "contact": "野芭蕉",
                "phone": "13812344321",
                "province": "",
                "city": "",
                "district": "",
                "addr": null,
                "note": null,
                "custom_field_values": [
                    {
                        "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk",
                        "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
                        "custom_field_label": "姓名",
                        "value": "xxxx11"
                    },
                    {
                        "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
                        "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
                        "custom_field_label": "来源",
                        "value": "A，B"
                    },
                    {
                        "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
                        "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
                        "custom_field_label": "性别",
                        "value": "A"
                    }
                ]
            }
        ],
        "total_count": 1,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 5.3 渠道详情

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/channels/ID?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 渠道 ID |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 渠道 ID |
| parent_id | String | 父渠道 ID |
| name | String | 渠道名称 |
| code | String | 渠道代码 |
| state | String | 状态，<br/>active 已激活<br/>unactive 未激活 |
| type | String | 渠道类型，<br/>Channels::Level0 总部<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| contact | String | 联系人 |
| phone | String | 联系电话 |
| province | String | 省代码 |
| city | String | 市代码 |
| district | String | 区代码 |
| addr | String | 详细地址 |
| note | String | 备注 |
| custom_field_values | Array | 自定义字段填写的值 |
| &emsp;&emsp;id | String | 自定义字段值对象 ID |
| &emsp;&emsp;custom_field_id | String | 自定义字段 ID |
| &emsp;&emsp;custom_field_label | String | 自定义字段名称 |
| &emsp;&emsp;value | String | 自定义字段值内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
        "parent_id": null,
        "code": "11111",
        "name": "cxxc11",
        "state": "active",
        "type": "Channels::Level1",
        "contact": "野芭蕉",
        "phone": "13812344321",
        "province": "",
        "city": "",
        "district": "",
        "addr": null,
        "note": null,
        "custom_field_values": [
            {
                "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk",
                "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
                "custom_field_label": "姓名",
                "value": "xxxx11"
            },
            {
                "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
                "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
                "custom_field_label": "来源",
                "value": "A，B"
            },
            {
                "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
                "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
                "custom_field_label": "性别",
                "value": "A"
            }
        ]
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 5.4 创建渠道

#### 请求示例

* HTTPS POST 请求

`https://api.lifanli.cn/api/open_v1/channels?access_token=TOKEN`

请求包体：

```
{
    "code": "QD001",
    "name": "渠道名称",
    "type": "Channels::Level1",
    "parent_id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
    "contact": "张三",
    "phone": "13712121212",
    "province": "110000",
    "city": "110100",
    "district": "110101",
    "addr": "xx 街道 101 号",
    "note": "备注信息",
    "custom_field_values": {
        "0": {
            "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
            "value": "xxxx11"
        },
        "1": {
            "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
            "value": ["A", "B"]
        },
        "2": {
            "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
            "value": "A"
        }
    }
}
```

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| code | String | 是 | 渠道代码 |
| name | String | 是 | 渠道名称 |
| type | String | 是 | Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| parent_id | String | 是 | 父渠道 ID |
| contact | String | 否 | 联系人 |
| phone | String | 否 | 联系电话 |
| province | String | 否 | 省代码 |
| city | String | 否 | 市代码 |
| district | String | 否 | 区代码 |
| addr | String | 否 | 详细地址 |
| note | String | 否 | 备注 |
| state | String | 否 | active 已激活<br/>unactive 未激活 |
| custom_field_values | Hash | 否 | 自定义字段需要填写的值 |
| &emsp;&emsp;custom_field_id | String | 是 | 自定义字段 ID |
| &emsp;&emsp;value | Hash | 是 | 自定义字段值 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 渠道 ID |
| parent_id | String | 父渠道 ID |
| name | String | 渠道名称 |
| code | String | 渠道代码 |
| state | String | 状态，<br/>active 已激活<br/>unactive 未激活 |
| type | String | 渠道类型，<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| contact | String | 联系人 |
| phone | String | 联系电话 |
| province | String | 省代码 |
| city | String | 市代码 |
| district | String | 区代码 |
| addr | String | 详细地址 |
| note | String | 备注 |
| custom_field_values | Array | 自定义字段填写的值 |
| &emsp;&emsp;id | String | 自定义字段值对象 ID |
| &emsp;&emsp;custom_field_id | String | 自定义字段 ID |
| &emsp;&emsp;custom_field_label | String | 自定义字段名称 |
| &emsp;&emsp;value | String | 自定义字段值内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "NmYQ65yWgEe7zrx8vkRGnJkpP3B0D2dO",
        "parent_id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
        "code": "QD001",
        "name": "渠道名称",
        "state": "active",
        "type": "Channels::Level1",
        "contact": "野芭蕉",
        "phone": "13812344321",
        "province": "",
        "city": "",
        "district": "",
        "addr": null,
        "note": null,
        "custom_field_values": [
            {
                "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk",
                "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
                "custom_field_label": "姓名",
                "value": "xxxx11"
            },
            {
                "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
                "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
                "custom_field_label": "来源",
                "value": "A，B"
            },
            {
                "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
                "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
                "custom_field_label": "性别",
                "value": "A"
            }
        ]
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 422,
    "errmsg": "code 缺失, name 缺失, contact 缺失, type 缺失, type 无效值, phone 缺失, parent_id 缺失"
}
```

### 5.5 更新渠道

#### 请求示例

* HTTPS PATCH 请求

`https://api.lifanli.cn/api/open_v1/channels/ID?access_token=TOKEN`

请求包体：

```
{
    "code": "QD001",
    "name": "新渠道名称",
    "type": "Channels::Level1",
    "parent_id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
    "contact": "张三",
    "phone": "13712121212",
    "province": "110000",
    "city": "110100",
    "district": "110101",
    "addr": "xx 街道 101 号",
    "note": "备注信息",
    "custom_field_values": {
        "0": {
            "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk"
            "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
            "value": "new value"
        },
        "1": {
            "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
            "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
            "value": ["A", "B", "c"]
        },
        "2": {
            "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
            "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
            "value": "B"
        }
    }
}
```

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 渠道 ID |
| code | String | 否 | 渠道代码 |
| name | String | 否 | 渠道名称 |
| type | String | 否 | 渠道类型，<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/> Channels::Level3 三级渠道<br/> Channels::TerminalShop 门店 |
| parent_id | String | 否 | 父渠道 ID |
| contact | String | 否 | 联系人 |
| phone | String | 否 | 联系电话 |
| province | String | 否 | 省代码 |
| city | String | 否 | 市代码 |
| district | String | 否 | 区代码 |
| addr | String | 否 | 详细地址 |
| note | String | 否 | 备注 |
| state | String | 否 | 状态 |
| custom_field_values | Hash | 否 | 自定义字段需要填写的值 |
| &emsp;&emsp;id | String | 是 | 自定义字段值对象 ID |
| &emsp;&emsp;custom_field_id | String | 是 | 自定义字段 ID |
| &emsp;&emsp;value | Hash | 是 | 自定义字段值 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 渠道 ID |
| parent_id | String | 渠道 ID |
| name | String | 渠道名称 |
| code | String | 渠道代码 |
| state | String | 状态，<br/>active 已激活<br/>unactive 未激活 |
| type | String | 渠道类型，<br/>Channels::Level1 一级渠道<br/>Channels::Level2 二级渠道<br/>Channels::Level3 三级渠道<br/>Channels::TerminalShop 终端店 |
| contact | String | 联系人 |
| phone | String | 联系电话 |
| province | String | 省代码 |
| city | String | 市代码 |
| district | String | 区代码 |
| addr | String | 详细地址 |
| note | String | 备注 |
| custom_field_values | Array | 自定义字段填写的值 |
| &emsp;&emsp;id | String | 自定义字段值对象 ID |
| &emsp;&emsp;custom_field_id | String | 自定义字段 ID |
| &emsp;&emsp;custom_field_label | String | 自定义字段名称 |
| &emsp;&emsp;value | String | 自定义字段值内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "NmYQ65yWgEe7zrx8vkRGnJkpP3B0D2dO",
        "parent_id": "2aDVvGPkNoXB0ExrzxneJ7ql4O1L65Wr",
        "code": "QD001",
        "name": "新渠道名称",
        "state": "active",
        "type": "Channels::Level1",
        "contact": "野芭蕉",
        "phone": "13812344321",
        "province": "",
        "city": "",
        "district": "",
        "addr": null,
        "note": null,
        "custom_field_values": [
            {
                "id": "80nMAG6vJwKqajN5yjwyDENLPOrZp2lk",
                "custom_field_id": "ElkwZW2ypY4JonNpln4G1orQaPBvXb6n",
                "custom_field_label": "姓名",
                "value": "new value"
            },
            {
                "id": "kl0ebxn9zM2DQQZ9KQ0MDVJr7Y8ZWoPy",
                "custom_field_id": "Aj3GZrm2bq5x3nodLyyM9nvMzRVwgWoN",
                "custom_field_label": "来源",
                "value": "A，B, C"
            },
            {
                "id": "yXKlZPB8Y0MqWwoWewa2qbQWxpko7VA4",
                "custom_field_id": "vRwpd0k4YN7xDZwyKGM5J5y6jgKrBeGP",
                "custom_field_label": "性别",
                "value": "B"
            }
        ]
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 422,
    "errmsg": "验证失败: 名称不能为空"
}
```

### 5.6 删除渠道

#### 请求示例

* HTTPS DELETE 请求

`https://api.lifanli.cn/api/open_v1/channels/ID?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 渠道 ID，请求地址中包含此 ID  |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| errcode | Integer | 返回码 |
| errmsg | String | 返回码描述内容 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "destroyed"
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

### 5.7 渠道自定义字段列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/channels/custom_fields?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data | Array | 返回的数据 |
| &emsp;&emsp;id | String | 自定义字段 ID |
| &emsp;&emsp;label | String | 自定义字段名称 |
| &emsp;&emsp;type | String | 自定义字段类型，<br/>CustomField::String 文字<br/>CustomField::CheckBoxes 多选<br/>CustomField::Select 单选<br/>CustomField::Picture 图片|
| &emsp;&emsp;options | Array | 单选或者多选的选项 |
| &emsp;&emsp;required | Boolean | 是否必填 |
| &emsp;&emsp;hint | String | 自定义字段说明 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": [
        {
            "id": "MlD5pPOqoGn3z2xgkAxbXKmZjwYNagRB",
            "label": "联系人姓名",
            "type": "CustomField::String",
            "options": null,
            "required": false,
            "hint": ""
        },
        {
            "id": "K6DyMlY8ZOzLWgJR52123dPapjqGwXv5",
            "label": "来源",
            "type": "CustomField::CheckBoxes",
            "options": [
                "A",
                "B",
                "C"
            ],
            "required": false,
            "hint": ""
        },
        {
            "id": "MlD5pPOqoGn3z2xgkwxbXKmZjwYNagRB",
            "label": "单选",
            "type": "CustomField::Select",
            "options": [
                "A",
                "B",
                "C"
            ],
            "required": false,
            "hint": ""
        }
    ]
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

## 6. 活动接口

### 6.1 活动列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/activities?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| activities | Array | 活动列表数组 |
| &emsp;&emsp;id | Integer | 活动ID
| &emsp;&emsp;title | String | 活动标题 |
| &emsp;&emsp;code | String | 活动编号 |
| &emsp;&emsp;start_at | Integer | 活动开始时间 |
| &emsp;&emsp;end_at | Integer | 活动结束时间 |
| &emsp;&emsp;created_at | Integer | 活动创建时间 |
| &emsp;&emsp;type | String | 活动类型，<br/>Activity 单码活动<br/>UnitsActivity 一物一码活动<br/>AntiFakeActivity 防伪溯源码<br/>SharingActivity 分享活动 |
| &emsp;&emsp;state | String | 状态，<br/>pending: 创建中<br/>generating: 正在生成二维码<br/>ready: 未开始<br/>enabled: 已开始<br/>disabled: 已停用<br/>expired: 已过期<br/>finished: 已完成 |
| &emsp;&emsp;amount | Integer | 二维码数量 |
| &emsp;&emsp;raffle_count | Integer | 抽奖次数 |
| &emsp;&emsp;attend_rule | String | 参与次数规则 |
| &emsp;&emsp;tags | Array | 活动标签 |
| &emsp;&emsp; awards | Array | 活动奖项 |
| &emsp;&emsp;&emsp;&emsp;id | Integer | 奖项ID |
| &emsp;&emsp;&emsp;&emsp;type | String | 抽奖规则,<br/>Award: 根据奖品数量随机抽奖<br/>SnAward: 根据二维码序号抽奖<br/>UserTagAward: 根据用户标签抽奖<br/>TimeRangeAward: 根据日期范围抽奖<br/>AttendingsAward: 根据参与次数抽奖<br/>LocationAward: 根据地理位置抽奖<br/>LocationRadiusAward: 根据坐标半径抽奖<br/>ContDaysAward: 根据连续参与指定天数抽奖<br/>ContAttendingsAward: 根据每N次参与抽奖<br/>EqualAttendingAward: 根据第N次参与抽奖 |
| &emsp;&emsp;&emsp;&emsp;title | String | 奖项名称 |
| &emsp;&emsp;&emsp;&emsp;quantity | Integer | 奖品数量 |
| &emsp;&emsp;&emsp;&emsp;position | Integer | 排序位置 |
| &emsp;&emsp;&emsp;&emsp;good_id | String | 礼品ID |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "activities": [
            {
                "id": "NO6qRrYwK48dVo7OjPoQmLZPD7g5ApaB",
                "code": "2ztvLRuR7w",
                "title": "cxcx",
                "start_at": 1598596440,
                "end_at": 1598769240,
                "created_at": 1598596440,
                "type": "UnitsActivity",
                "state": "pending",
                "amount": 2,
                "raffle_count": 0,
                "attend_rule": "none",
                "tags": [
                  '促销'
                ],
                "awards": [
                    {
                        "id": "K0WdL89rq6DQex2yLzYnOgJ5G3EopvaA",
                        "type": "Award",
                        "title": "奖品",
                        "quantity": 20,
                        "position": 0,
                        "good_id": "2ryAMzN765DZnxona4lBQWj9qvaEmp0e"
                    }
                ]
            },
            {
                "id": "5EvrYwRZq7gGdole8B94aN0bWOPeAkDp",
                "code": "MaD2veV7DA",
                "title": "cyl分享活动",
                "start_at": 1598524200,
                "end_at": 1598783400,
                "type": "SharingActivity",
                "state": "enabled",
                "amount": 10,
                "raffle_count": 3,
                "attend_rule": "none"
                "tags": [],
                "awards": []
            }
        ],
        "total_count": 2,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 6.2 活动详情

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/activities/ID?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| id | String | 是 | 活动 ID |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 活动 ID |
| code | String | 活动编号 |
| title | String | 活动标题 |
| start_at | Integer | 开始时间 |
| end_at | Integer | 结束时间 |
| created_at | Integer | 活动创建时间 |
| type | String | 活动类型，<br/>Activity 单码活动<br/>UnitsActivity 一物一码活动<br/>AntiFakeActivity 防伪溯源码<br/>SharingActivity 分享活动
| state | String | 状态，<br/>pending: 创建中<br/>generating: 正在生成二维码<br/>ready: 未开始<br/>enabled: 已开始<br/>disabled: 已停用<br/>expired: 已过期<br/>finished: 已完成 |
| amount | Integer | 二维码数量 |
| raffle_count | Integer | 抽奖次数 |
| attend_rule | Integer | 参与次数规则 |
| tags | Array | 活动标签 |
| awards | Array | 活动奖项 |
| &emsp;&emsp;id | Integer | 奖项ID |
| &emsp;&emsp;type | String | 抽奖规则,<br/>Award: 根据奖品数量随机抽奖<br/>SnAward: 根据二维码序号抽奖<br/>UserTagAward: 根据用户标签抽奖<br/>TimeRangeAward: 根据日期范围抽奖<br/>AttendingsAward: 根据参与次数抽奖<br/>LocationAward: 根据地理位置抽奖<br/>LocationRadiusAward: 根据坐标半径抽奖<br/>ContDaysAward: 根据连续参与指定天数抽奖<br/>ContAttendingsAward: 根据每N次参与抽奖<br/>EqualAttendingAward: 根据第N次参与抽奖 |
| &emsp;&emsp;title | String | 奖项名称 |
| &emsp;&emsp;quantity | Integer | 奖品数量 |
| &emsp;&emsp;position | Integer | 位置 |
| &emsp;&emsp;good_id | String | 礼品ID |


1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "7b685KRyPgGBYn45jxzD0exXLJvVqmW2",
        "code": "2ztvLRuR7w",
        "title": "cxcx",
        "start_at": 1598524200,
        "end_at": 1598783400,
        "type": "UnitsActivity",
        "state": "pending",
        "amount": 2,
        "raffle_count": 0,
        "attend_rule": "none"
        "tags": [
          '促销'
        ],
        "awards": [
            {
                "id": "K0WdL89rq6DQex2yLzYnOgJ5G3EopvaA",
                "type": "Award",
                "title": "奖品",
                "quantity": 20,
                "position": 0,
                "good_id": "2ryAMzN765DZnxona4lBQWj9qvaEmp0e"
            }
        ]
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

## 7. 兑奖订单接口

### 7.1 兑奖订单列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/award_orders?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| award_orders | Array | 兑奖订单列表数组 |
| &emsp;&emsp;number | String | 订单编号 |
| &emsp;&emsp;state | String | 状态<br/>pending 未提交<br/>submitted 已提交<br/>paid 已支付<br/>  confirmed 待发货<br/>delivering 发货中<br/>delivery_failed 发货失败<br/>delivered 待收货<br/>canceled 已关闭<br/>completed 已完成 |
| &emsp;&emsp;created_at | Integer | 创建时间 |
| &emsp;&emsp;submitted_at | Integer | 下单时间 |
| &emsp;&emsp;completed_at | Integer | 完成时间 |
| &emsp;&emsp;province | String | 参与人所在省份 |
| &emsp;&emsp;province | String | 参与人所在城市 |
| &emsp;&emsp;address | String | 参与人所在地 |
| &emsp;&emsp;completed_at | Integer | 完成时间 |
| &emsp;&emsp;activity | Hash | 活动 |
| &emsp;&emsp;&emsp;&emsp;id | String | 活动 ID |
| &emsp;&emsp;&emsp;&emsp;title | String | 活动标题 |
| &emsp;&emsp;good | Hash | 礼品 |
| &emsp;&emsp;&emsp;&emsp;id | String | 礼品 ID |
| &emsp;&emsp;&emsp;&emsp;name | String | 礼品名称 |
| &emsp;&emsp;&emsp;&emsp;par | Decimal | 金额 |
| &emsp;&emsp;&emsp;&emsp;points_par | Integer | 赠送积分 |
| &emsp;&emsp;user | Hash | 兑奖用户 |
| &emsp;&emsp;&emsp;&emsp;id | String | 兑奖用户 ID |
| &emsp;&emsp;&emsp;&emsp;nickname | String | 用户昵称 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "award_orders": [
            {
                "number": "3124090673",
                "state": "completed",
                "created_at": 1598586595,
                "submitted_at": 1598586605,
                "completed_at": 1598586605,
                "activity": {
                    "id": "Lw8lOvGd2JXRmnpL1dnW5kj3YVD0PANy",
                    "title": "大转盘"
                },
                "good": {
                    "id": "pBm76DZN8P5Y3o3d7jwLEVdMR2JQyx9r",
                    "name": "普通微信红包",
                    "par": "3.88",
                    "points_par": 0
                },
                "user": {
                    "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
                    "nickname": "云莉"
                }
            },
            {
                "number": "0249673001",
                "state": "pending",
                "created_at": 1598352802,
                "submitted_at": null,
                "completed_at": null,
                "province": "-",
                "city": "-",
                "address": "-",
                "activity": {
                    "id": "5EvrYwRZq7gGdole8B94aN0bWOPeAkDp",
                    "title": "cyl分享活动"
                },
                "good": {
                    "id": "aNxpn5P72GjRm4j1XXg8rLedklMOQbY1",
                    "name": "普通微信红包",
                    "par": "3.88",
                    "points_par": 0
                },
                "user": {
                    "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
                    "nickname": "云莉"
                }
            }
        ],
        "total_count": 2,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```

### 7.2 兑奖订单详情

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/award_orders/NUMBER?access_token=TOKEN`

#### 参数说明

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| number | String | 是 | 兑奖订单 ID |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| number | String | 订单编号 |
| state | String | 状态<br/>pending 未提交<br/>submitted 已提交<br/>paid 已支付<br/>  confirmed 待发货<br/>delivering 发货中<br/>delivery_failed 发货失败<br/>delivered 待收货<br/>canceled 已关闭<br/>completed 已完成 |
| created_at | Integer | 创建时间 |
| submitted_at | Integer | 下单时间 |
| completed_at | Integer | 完成时间 |
| province | String | 参与人所在省份 |
| province | String | 参与人所在城市 |
| address | String | 参与人所在地 |
| completed_at | Integer | 完成时间 |
| activity | Hash | 活动 |
| &emsp;&emsp;id | String | 活动 ID |
| &emsp;&emsp;title | String | 活动标题 |
| good | Hash | 礼品 |
| &emsp;&emsp;id | String | 礼品 ID |
| &emsp;&emsp;name | String | 礼品名称 |
| &emsp;&emsp;par | Decimal | 金额 |
| &emsp;&emsp;points_par | Integer | 赠送积分 |
| user | Hash | 兑奖用户 |
| &emsp;&emsp;id | String | 兑奖用户 ID |
| &emsp;&emsp;nickname | String | 用户昵称 |
| &emsp;&emsp;openid | String | 用户openid |
| &emsp;&emsp;phone | String | 用户手机号 |
| unit_sn | String | 活动码序号（当有追溯码时该返回为空字符串） |
| t_unit | Hash | 追溯相关（当有追溯码时返回该值） |
| &emsp;&emsp;sn | String | 追溯码序号 |
| &emsp;&emsp;t_unit_spec | String | 规格 |
| &emsp;&emsp;product | Hash |  产品 |
| &emsp;&emsp;&emsp;&emsp;name | String | 产品名称 |
| &emsp;&emsp;&emsp;&emsp;code | String | 产品代码 |
| &emsp;&emsp;channel | Hash |  产品所在渠道 |
| &emsp;&emsp;&emsp;&emsp;id | String | 渠道ID |
| &emsp;&emsp;&emsp;&emsp;name | String | 渠道名称 |
| &emsp;&emsp;&emsp;&emsp;code | String | 渠道代码 |
| &emsp;&emsp;&emsp;&emsp;phone | String | 渠道联系电话 |
| &emsp;&emsp;t_channel_receipts | Array | 出入库记录（当有追溯码时会返回） |
| &emsp;&emsp;&emsp;&emsp;code | String | 出/入库单单号 |
| &emsp;&emsp;&emsp;&emsp;state | String | 出/入库单状态 |
| &emsp;&emsp;&emsp;&emsp;state_text | String | 出/入库单状态（中文） |
| &emsp;&emsp;&emsp;&emsp;created_at | Interger | 出/入库单创建时间 |
| &emsp;&emsp;&emsp;&emsp;out_channel | String | 出/入库单发货渠道 |
| &emsp;&emsp;&emsp;&emsp;in_channel | String | 出/入库单收货渠道 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "id": "ZnvxqKWzpY2lgrLQe2vy6aV0r9M5NbXJ",
        "number": "3124090673",
        "state": "completed",
        "created_at": 1598586595,
        "submitted_at": 1598586605,
        "completed_at": 1598586605,
        "province": "北京市",
        "city": "北京市",
        "address": "北京市北京市东城区正义路正义路2号",
        "activity": {
            "id": "Lw8lOvGd2JXRmnpL1dnW5kj3YVD0PANy",
            "title": "大转盘"
        },
        "good": {
            "id": "pBm76DZN8P5Y3o3d7jwLEVdMR2JQyx9r",
            "name": "普通微信红包",
            "par": "3.88",
            "points_par": 0
        },
        "user": {
            "id": "MxVKpAd3ye75rexYyzJZ4N2ZomP601Qn",
            "openid": "default",
            "nickname": "default",
            "phone": "13025927863"
        },
        "unit_sn": "",
        "t_unit": {
            "sn": "000001000",
            "t_unit_spec": "1垛x2箱x3盒x4瓶",
            "product":{
              "name": "default",
              "code": "default"
            }
            "t_channel_receipts": [
                {
                    "code": "RK20200721164357",
                    "state": "completed",
                    "state_text": "已入库",
                    "created_at": 1595321037,
                    "out_channel": "总部",
                    "in_channel": "测试渠道"
                },
                {
                    "code": "CK20200721164203",
                    "state": "completed",
                    "state_text": "已出库",
                    "created_at": 1595320928,
                    "out_channel": "总部",
                    "in_channel": "测试渠道"
                },
                {
                    "code": "RK20200721163125",
                    "state": "completed",
                    "state_text": "已入库",
                    "created_at": 1595320288,
                    "out_channel": "生产",
                    "in_channel": "总部"
                }
            ]
        }
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 404,
    "errmsg": "未找到该资源"
}
```

## 8. 礼品接口

### 8.1 礼品列表

#### 请求示例

* HTTPS GET 请求

`https://api.lifanli.cn/api/open_v1/goods?access_token=TOKEN`

| 参数 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| access_token | String | 是 | 获取到的凭证 |
| page | Integer | 否 | 当前页面，默认 1 |
| per_page | Integer | 否 | 每页记录数，默认 20 条，最大 200 条 |

#### 返回说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| goods | Array | 礼品列表数组 |
| &emsp;&emsp;id | String | 礼品ID |
| &emsp;&emsp;type | String | 礼品类型，<br/>Good::VirtualGood 非物流礼品<br/>Good::PhysicalGood 实物物流礼品<br/>Good::CouponGood 第三方卡券<br/>Good::LflCoupon 自主卡券<br/>Good::MobileFee 话费<br/>Good::RedPack 手拆红包(自发)<br/>Good::LflRedPack 手拆红包<br/>Good::GroupRedPack 裂变红包(自发)<br/>Good::LflGroupRedPack 裂变红包<br/>Good::PointsGood 积分<br/>Good::CashGood 小额红包<br/>Good::CardGood 微信卡券<br/>Good::Transfer 微信直达红包(自发)<br/>Good::LflTransfer 微信直达红包<br/>Good::LinkCoupon 外链卡券 |
| &emsp;&emsp;name | String | 名称 |
| &emsp;&emsp;payment_type | String | 支付类型,<br/>points 仅限积分支付<br/>cash 仅限现金支付<br/>both 积分+现金<br/>free 自由组合 |
| &emsp;&emsp;par | Decimal  | 金额 |
| &emsp;&emsp;points | integer | 积分价格 |
| total_count | Integer | 总记录数 |
| current_page | Integer | 当前页码 |
| per_page | Integer | 每页记录数 |

1）参数正确时 JSON 返回示例

```
{
    "errcode": 0,
    "errmsg": "ok",
    "data": {
        "goods": [
            {
                "id": "jb1XqDNPABeMV3gxNo8vnapKLW0JzQyR",
                "type": "Good::PointsGood",
                "name": "1积分",
                "payment_type": "points",
                "par": "0.0",
                "points": 0
            },
            {
                "id": "2ryAMzN765DZnxona4lBQWj9qvaEmp0e",
                "type": "Good::LflTransfer",
                "name": "1元红包",
                "payment_type": "points",
                "par": "1.0",
                "points": 0
            }
        ],
        "total_count": 2,
        "current_page": 1,
        "per_page": 20
    }
}
```

2）参数错误时 JSON 返回示例

```
{
    "errcode": 401,
    "errmsg": "The access token is invalid"
}
```
