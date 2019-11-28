# Dynamic Client Registration v3.2

# Version Control


| Version |Date |Author |Comments |
| --- |--- |--- |--- |
| 3.1-draft3 |07 Sep 2018 |OB R/W API Team |First draft that picks up from where The Open Banking OpenID Dynamic Client Registration v1.0.0 left off. |
| 3.1-draft4 |30-Oct-2018 |OB R/W API Team |Overview - added a sentence to state that some client management aspects will be covered by the specification Basics / Of JWS and JWKS - changed "the following two limitations" to "the following two limitations" Endpoints - Added a table of endpoints - Introduced endpoints for PUT, GET and DELETE operations Endpoints / POST - Changed "responds with a JWS description" to "responds with a JSON description" in keeping with the current specification Authentication Section split into two parts for authentication of different types of requests Data Model / OBClientRegistrationRequest1 Updated section with relevant details on lengths, regex etc. Updated section to state situations when ASPSPs may change the request parameters or reject requests Data Model / OBClientRegistrationRequest1/Data Dictionary response_types: Modified to state that default value should be code id_token software_id: Modified to state that this must be a UUID software_statement: Updated to state that the data model for OB issued software statements are documented as prt of the directory specifications Added token_endpoint_auth_signing_alg Updated description of how DN should be matched. |
| 3.1-RC1 |14 Sep 2018 |OB R/W API Team |Data Dictionary - Updated the definition of the iss claim to state "For SSAs issued by the OB Directory, this must be the software_id". This brings it in line with the current usage of iss. - Updated the definition of the response_types claim to clarify situations in which the requested response types can be rejected - Updated the definition of the software_id claim and removed "client name and may take the software_id from either the SSA or the TPP as a hint only." Removed references to Article 34 and PSD2 in POST Operations section. Updated links to Swagger specification. |
| 3.1 |30 Nov 2018 |OB R/W API Team |Version 3.1 final release. No changes from Version 3.1 RC1. |
| 3.1.1-draft1 |31 Jan 2019 |OB R/W API Team |Corrected multiplicity of software_id in Data Model / OBClientRegistrationRequest1/Data Dictionary. Changed from 0..* to 0..1 |
| 4.0-draft6 |01 Mar 2019 |OB R/W API Team |Corrected claim tls_client_auth_dn to tls_client_auth_subject_dn so that it matches the IANA registered claims for Client Registration Metadata as per the MTLS specification |
| 4.0-draft7 |18 Mar 2019 |OB R/W API Team |Corrected scope multiplicity. Increased length to 256. Added description to state that these are space delimited scopes. Clarified that specifying token_endpoint_auth_method of client_secret_basic and client_secret_post would result in a non-fapi compliant client. Added client_secret_jwt as a enumeration value for token_endpoint_auth_method Changed multiplicity of token_endpoint_auth_signing_alg and set to 0..1. Specified that this is mandatory for private_key_jwt and client_secret_jwt |
| 3.2-RC1 |29 Mar 2019 |OB R/W API Team |Modified version number to follow new versioning strategy Updated software_id to be 22 chars in length. Added client_id_issued_at and client_secret_expires_at claims to OBClientRegistrationRequest1. Added an Appendix to indicate where the OBIE Directory SSA documentation is located (based on inputs at TDA on 24-Apr-2019. |


# Overview

This specification defines the APIs for a TPP to submit a Software Statement Assertion to an ASPSP for the purpose of creating OAuth clients that are registered with ASPSP.
The document goes on to identify a set of situations when a TPP may need to modify the client. The ASPSPs may implement optional APIs defined here to achieve that behaviour or implement a service management capability to deal with these changes.
The API supercedes the Open Banking OpenID Connect (OIDC) Dynamic Client Registration Profile.
This follows on from recommendations made in [https://openid.net/specs/openid-financial-api-part-2.html#tls-considerations](https://openid.net/specs/openid-financial-api-part-2.html#tls-considerations).
 
> **6.3.4 Dynamic Client Registration** 
>
> It is the opinion of the OBIE that ASPSPs will need to ensure that TPPs can be registered in a seamless, ideally fully automated basis with registrations processed and TPP responses provided in real-time to avoid the perception / imposition of obstacles. Capability is already provided by the OBIE to support this via the Participant Identification API.
 
> **6.4.2 Re-registration at ASPSPs** 
>
> As a result of impact 6.3.1 or 6.3.2, TPPs may be required to re-onboard with ASPSPs that upgrade their Authorisation server capabilities. OBIE suggests that future delivery phases determine the materiality of this issue and the feasibility of ASPSPs parallel running solutions to enable a smooth migration. It is the expectation of IESG TPP representatives that steps be taken to avoid re-registration requirements.

## Document Structure

This document consists of the following parts:
**Overview:** Provides an overview of the scope of the API and the key decisions and principles that contributed to the specification.

**Basics:** Identifies the resources, operations that are permitted on those resources, and various special cases.

**Endpoints:** Provides the list of endpoints for the API specification.

**Authentication:** Specifies the means for TPPs to authenticate themselves prior to calling the APIs

**Swagger Specifications:** Provides links to the swagger specifications for the APIs.

**Usage Examples:** Examples for how the APIs can be used

# Basics

## Problem Space

The Open Banking Read/Write API standard relies on FAPI-RW as a means for authenticating PSUs and TPPs. To enable this capability a TPP must register one or more <em>clients </em>with the ASPSP.
The Dynamic Client Registration APIs allow this to be carried out in a manner that offers very low friction and removes hurdles and barriers to entry for the TPP to interact with the ASPSP.
The specification is designed to offer a high degree of flexibility of implementation.

## Underlying Specifications

The Open Banking Dynamic Client Management specification builds upon the capabilities and concepts introduced by the following standards:

[RFC 7591](https://tools.ietf.org/html/rfc7591): OAuth 2.0 Dynamic Client Registration

[RFC 7592](https://tools.ietf.org/html/rfc7592): OAuth 2.0 Dynamic Client Registration Management Protocol

[OpenID Connect Dynamic Client Registration 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-registration-1_0.html)

## Software Statement

RFC 7591 defines a Software Statement as

>Software Statement
>
      A digitally signed or MACed JSON Web Token (JWT)[RFC7519] that 
      asserts metadata values about the client software.  In some cases,
      a software statement will be issued directly by the client
      developer.  In other cases, a software statement will be issued by
      a third-party organization for use by the client developer.  In
      both cases, the trust relationship the authorization server has
      with the issuer of the software statement is intended to be used
      as an input to the evaluation of whether the registration request
      is accepted.  A software statement can be presented to an
      authorization server as part of a client registration request.
>

In our context, a Software Statement may be issued by any actor that is trusted by the authorisation server. This may include, but is not limited to:
* The TPP itself
* The Directory solution provided by OBIE
* Another Directory service provider

A software statement that is signed by its issuer is referred to as a Software Statement Assertion (SSA). An SSA is represented as a JSON Web Signature (JWS) [RFC7515](https://tools.ietf.org/html/rfc7515).

This specification does not dwell upon the parties that should be trusted by an ASPSP.

An ASPSP must specify on its Developer Portal the parties that it trusts and accepts SSAs from.

This specification does not include the claims that should form a part of the software statement or the steps the ASPSP must carry out in processing those claims.

These details should be provided by the software statement issuer and may differ from one issuer to another.

### Self-signed SSA

An ASPSP may opt to accept SSAs that are issued directly by a TPP without a central issuer.

In such situations, the ASPSP may accept SSAs that are not signed (indicated by a JOSE claim of `alg` set to `none`)

Where ASPSPs accept self-signed SSAs, they must specify this on their Developer Portal along with the claims that it expects to be included in the SSA.

## Discovery

The URL of the registration end-point should be advertised on the ASPSP's OIDC Discovery Endpoint using the registration_endpoint claim as defined in https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata.

## Of JWS &amp; JWKS

The request payload for a Dynamic Client Registration call and the software statement included in the call is structured as a JWS.

In order to verify the contents of the request and the SSA the ecosystem has to rely on a set of JSON Web Key Stores (JWKS) that store the public part of key used to sign the JWT.

The structure and URL of the JWKS must be agreed between the SSA issuer and its consumers (TPPs and ASPSPs).

The mechanism for determining the key that is used is not part of this specification but is subject to the following limitations:

* The public key must not be embedded in the payload itself (e.g. by using x5c claim in the JOSE header)
  
* The URL for the JWKS must not be embedded in the payload itself (e.g. by using x5u claim in the JOSE header)
  
* The JWKS must be secured over TLS using TLS 1.2 and the FAPI approved set of ciphers as defined in https://openid.net/specs/openid-financial-api-part-2.html#tls-considerations.

# Endpoints

This section provides a list of available API endpoints for Dynamic Client Registration.

The ASPSP may have a different URL for the endpoints as long as it is advertised appropriately in the ASPSP's Discovery endpoint.

The ASPSP must have the same URL for all the HTTP operations on that endpoint.

| HTTP Operation |Endpoint |Mandatory ? |Scope |Grant Type |Message Signing |Idempotency Key |Request Object |Response Object |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |
| POST |POST /register |Conditional |NA |NA |No |No |OBClientRegistrationRequest1 |OBClientRegistrationResponse1 |
| GET |GET /register/{ClientId} |Optional |NA |Client Credentials |No |No |NA |OBClientRegistrationResponse1 |
| PUT |PUT /register/{ClientId} |Optional |NA |Client Credentials |No |No |OBClientRegistrationRequest1 |OBClientRegistrationResponse1 |
| DELETE |DELETE /register/{ClientId} |Optional |NA |Client Credentials |No |No |NA |NA |



## POST /register


```json
POST /register
```



The API allows the TPP to request the ASPSP to register (create) a new client.

The TPP submits a JWS payload that describes the characteristics of the client to be created. 

If client creation is successful, the ASPSP responds with a JSON payload that describes the client that was created.

The TPP can then use the client to access resources on the ASPSP's resource server.

If client creation is unsuccessful, the ASPSP responds with an error payload.

## GET /register/{ClientId}


```json
GET /register/{ClientId}
```



The API allows the TPP to retrieve the details for a client that has already been registered.

This API is wholly optional for an ASPSP to implement.

The ASPSP may provide a service desk function for a TPP to request their client details. This is optional for an ASPSP to provide.

The request consists of one path parameter - the `ClientId` - that the TPP wants to retrieve details for.

If the request is successful and the identifier matches the client to whom the Client Credentials grant access token was issued, the ASPSP must return an object of type `OBClientRegistrationRequest1`.

If the `ClientId` is unknown, the ASPSP responds with an `Unauthorized` status code and immediately revokes the access token.

## PUT /register/{ClientId}


```json
PUT /register/{ClientId}
```


The API allows the TPP to request the ASPSP to modify one or more attributes related to an existing client.

This API is wholly optional for an ASPSP to implement.

The ASPSP may provide a service desk function for a TPP to modify their client details. This is optional for an ASPSP to provide.

The TPP submits the `ClientId` path parameter and a JWS payload that describes the characteristics of the client to be modified. This must include all the claims - including ones that will not be modified.

The ASPSP may reject the request if it does not support changes to certain claims.

The ASPSP must not invalidate long lived access tokens that are issued to the client.

If client modification is successful, the ASPSP responds with a JSON payload that describes the client that was created.

If the `ClientId` is unknown, the ASPSP responds with an `Unauthorized` status code and immediately revokes the access token.

If client modification is unsuccessful, the ASPSP responds with an error payload.

## DELETE /register/{ClientId}


```json
DELETE /register/{ClientId}
```

The API allows the TPP to request the ASPSP to delete an existing client.

This API is wholly optional for an ASPSP to implement.

The ASPSP may provide a service desk function to cater to this functionality. 

This is optional for an ASPSP to provide.

The request consists of one path parameter - the `ClientId` - that the TPP wants to delete.

If the request is successful and the client Id matches the client to whom the client-credentials grant access token was issued, the ASPSP must delete the client and invalidate long lived access tokens that were issued to the client.

If the `ClientId` is unknown, the ASPSP responds with an `Unauthorized` status code and immediately revokes the access token.

# Authentication

## POST Operations

These APIs rely on TLS Mutual Authentication for authenticating the TPP.

## GET, PUT and DELETE operations

TPPs must authenticate themselves with a client credentials grant in order to get access to the GET, PUT and DELETE operations.

A `scope` need not be specified for the grant.

# Data Model

## OBClientRegistrationRequest1

### Data Dictionary

The table below identifies the claims that may be included in a JWT body for a Dynamic Client Registration POST and PUT requests.
The API responds with the same set of claims, but as part of a JSON object. It includes all the claims in the `software_statement` provided in the request, but each of these is flattened out as a top-level attribute of the JSON object.

The last column identifies whether the claims are provided in the request, response or both.

Prior to making a request, the TPP must query the ASPSP's OIDC .well-known end-point to identify the subset of code values that are supported by the ASPSP.

If the requests contains a value that the ASPSP does not support, the ASPSP must either:

* reject the request with an appropriate error message and error code
* accept the request and modify the value of the field to one that it supports. It must return the modified value as part of the response.

An ASPSP may ignore claims in the request that it cannot process.

| Name |Occurrence |XPath |EnhancedDefinition |Class |Codes |Pattern |Location |
| --- |--- |--- |--- |--- |--- |--- |--- |
| iss |1..1 |iss |Identifier for the TPP. This value must be unique for each TPP registered by the issuer of the SSA. The value must be a Base62 encoded GUID. For SSAs issued by the OB Directory, this must be the software_id |String (22) | |^[0-9a-zA-Z]{1,22}$ |Request only |
| iat |1..1 |iat |The time at which the request was issued by the TPP expressed as "seconds since the epoch" |Integer | |Unix timestamp |Request only |
| exp |1..1 |exp |The time at which the request expires expressed as seconds since the epoch. An ASPSP processing the request must reject requests where the current time is greater than the time specified in the claim. |Integer | |Unix timestamp |Request only |
| aud |1..1 |aud |The audience for the request. This should be the unique identifier for the ASPSP issued by the issuer of the software statement. An ASPSP processing the software statement may validate the value of the claim and reject software statements for which the ASPSP is not the audience. The value must be a Base62 encoded GUID. |String (18) | |^[0-9a-zA-Z]{1,18}$ |Request only |
| jti |1..1 |jti |A unique identifier for the JWT. The value must be a UUIDv4 GUID. |String (36) | |`^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$` |Request only |
| client_id |0..1 (request) 1..1 (response) |client_id |The client identifier generated by the ASPSP |String (36) | | |Both |
| client_secret |0..1 |client_secret |A shared secret generated by the ASPSP. The ASPSP may choose not to generate the client_secret if it does not support client authentication mechanisms that require it. |String (36) | | |Response |
| client_id_issued_at |0..1 |client_id_issued_at |Time at which the client identifier was issued expressed as "seconds since the epoch". |Integer | |Unix timestamp |Response |
| client_secret_expires_at |0..1 |client_secret_expires_at |Time at which the client secret will expire expressed as "seconds since the epoch". The value must be populated if a client_secret is returned. Set to zero if the client_secret does not expire. |Integer | |Unix timestamp |Response |
| redirect_uris |1..* |redirect_uris |Registered URIs the TPP will use to interact with the ASPSP AS. If the software statement defines a master set of redirect URIs, this must match or be a subset of the redirect URIs in the SSA. Each of the URIs must adhere to the following rules: The URI MUST use the https scheme The URI MUST NOT contain a host with a value of localhost If the request_uris metadata element is omitted from the request, the entire contents of the software_redirect_uris element in the SSA are considered to be requested by the TPP. |String[] (Each string upto 256) | |URL |Both |
| token_endpoint_auth_method |1..1 | |Specifies which Token endpoint authentication method the TPP wants to use. private_key_jwt : if requested the OP should extract the TPPs JWKS location from the software statement assertion included. It should be noted that only tls_client_auth and private_key_jwt are FAPI compliant. |String (32) |private_key_jwt client_secret_jwt client_secret_basic client_secret_post tls_client_auth | |Both |
| grant_types |1..* | |A JSON array specifying what the TPP can request to be supplied to the token endpoint as exchange for an access token |String[] (32) |client_credentials authorization_code refresh_token | |Both |
| response_types |0..* | |A JSON array specifying what the TPP can request to be returned from the ASPSP authorisation endpoint. ASPSPs MAY reject the request if any of the requested response_types are not supported by it (as advertised at its .well-known end-points) Defaults to code id_token if not specified. |String[] (32) |code code id_token | |Both |
| software_id |0..1 | |If specified, the software_id in the request MUST match the software_id specified in the SSA. ASPSPs can choose to allow multiple registrations for a given software statement. The Software ID must be represented as a Base62 UUID |String (22) | |^[0-9a-zA-Z]{1,22}$ |Both |
| scope |1..1 | |Scopes the client is asking for (if not specified, default scopes are assigned by the AS). This consists of a list scopes separated by spaces. |String(256) | | |Both |
| software_statement |1..1 | |Software statement assertion issued by the issuer. The data model for the software statements issued by the Open Banking directory are documented as part of the Directory Specification. |JWS | | |Both |
| application_type |1..1 | | |String (32) |web mobile | |Both |
| id_token_signed_response_alg |1..1 | |Algorithm which the TPP expects to sign the id_token, if an id_token is returned. |String (5) |Supported values as constrained by FAPI-RW | |Both |
| request_object_signing_alg |1..1 | |Algorithm which the TPP expects to sign the request object if a request object will be part of the authorization request sent to the ASPSP. |String (5) |Supported values as constrained by FAPI-RW | |Both |
| token_endpoint_auth_signing_alg |0..1 | |Algorithm which the TPP uses to authenticate with the token endpoint if using private_key_jwt or client_secret_jwt. Must be specified if token_endpoint_auth_method is private_key_jwt or client_secret_jwt |String (5) |Supported values as constrained by FAPI-RW | |Both |
| tls_client_auth_subject_dn |0..1 | |This value must be set iff token_endpoint_auth_method is set to tls_client_auth The tls_client_auth_subject_dn claim MUST contain the DN of the certificate that the TPP will present to the ASPSP token endpoint. The ASPSP may decide to match only a part of the DN so that the match is based only on the part of the DN that will be immutable for the TPP across all EIDAS certificates issued to it. |String (128) | | |Both |


## Error Structure

In the case where the ASPSP makes a negative determination and refuses to create a client, the ASPSP MUST return a client registration error response to the TPP conforming to Section 3.2.2 of [RFC7591].

## Data Mapping

This section of the specification is non-normative. The objective is to provide an overview of the various data items in the ecosystem and how they flow across from one to the other.

| Data Item |Description |NCA |ETSI format EIDAS Certificate |Open Banking Directory Record |Open Banking Directory SSA |Registration Request |Client Record |Access Token |
| --- |--- |--- |--- |--- |--- |--- |--- |--- |
**NCA Registration ID** |**A unique and immutable identifier for a TPP. <BR/> The ID is publicly available and visible to all entities** | The NCA is responsible for issuing the ID. <BR/>Notes: <BR/> - There are some NCAs in Europe that currently do not issue a unique identifier for TPPs. <BR/> - The FCA currently mutates the ID when a new role is added to a TPP. However, they have confirmed that this practice will be discontinued and each organisation will have a single immutable registration number. |The NCA registration number is embedded in the Subject field of EIDAS certificates that follow the ETSI standard. |Each PSP in the OB Directory has a unique NCA ID associated with it |Included |Where the client uses MTLS for token endpoint authentication, the NCA registration id forms a part of the `tls_client_auth_subjet_dn` claim.<BR/> This is used to bind the client to a specific DN in the certificate used to establish the TLS session. |Referenced |In situations where the token endpoint is protected by MTLS, the client is verified by binding the registered `tls_client_auth_subject_dn` claim with the DN of the certificate used to establish the TLS session |
**org_id** |**A unique and immutable identifier for a PSP issued by a Federation Trust Service Provider such as the Open Banking Directory.** | NA |org_id will not be specified on an EIDAS certificate |Issued and maintained by the Directory |Included in the software statement |Specified in the `iss` claim |Referenced |NA |
**software_id** |**A unique and immutable identifier for a piece of software belonging to a PSP.<BR/> The identifier is issued by a Federation Trust Service Provider such as the Open Banking Directory.<BR/> A PSP may register one or more software statements.<BR/> A software statement can only belong to a single PSP**| NA |Not specified on EIDAS certificates |Issued and maintained by the Directory |Included in the software statement |Not specified in the request object |Referenced |NA |
**scope** |**A PSP may be registered as a PISP or AISP with the NCA.<BR/> This is reflected in the scopes that the TPP can have.** | Registration type - PISP/AISP |Specified in the EIDAS certificates |Maintains a reference of the roles permitted for a TPP. |Included |Specified in the scope claimed. This must be a subset of the scopes in the SSA |Associated with specific scope that the TPP has. |Associated with a sub-set of the scopes permitted to the client |
**client_id** |**A unique and immutable identifier that identifies a specific OIDC client.<BR/> The identifier shared between the ASPSP and TPP.<BR/> A TPP may have multiple clients (and client_ids) with each ASPSP.** | NA |Not specified on EIDAS certificates |NA |NA |A TPP may request for a specific client_id to be issued to it. The ASPSP may ignore the claim. |Unique (to the the ASPSP) and immutable identifier |An access token is issued to a specific client. |


# Swagger Specification

The Swagger Specification for the Dynamic Client Registration API can be downloaded from the following links:
* [JSON](https://raw.githubusercontent.com/OpenBankingUK/client-registration-api-specs/v3.2-RC1/dist/client-registration-swagger.json)
* [YAML](https://raw.githubusercontent.com/OpenBankingUK/client-registration-api-specs/v3.2-RC1/dist/client-registration-swagger.yaml)

# Appendix 1: OBIE Directory SSA

This specification does not include the claims that should form a part of the software statement as this should be provided by the software statement issuer and may differ from one issuer to another.
For organizations that rely upon OBIE Directory-issued SSAs, the swagger specification can be found in the repository at https://github.com/OpenBankingUK/directory-api-specs in the [YAML](https://github.com/OpenBankingUK/directory-api-specs/blob/master/directory-api-swagger.yaml) file.
