| 名前 | 説明 |
| --- | --- |
| cloud-infrastructure-security | クラウドプラットフォームへのデプロイ、インフラ構成、IAMポリシー管理、ロギング/モニタリングの設定、またはCI/CDパイプラインの実装時に使用します。ベストプラクティスに基づいたクラウドセキュリティチェックリストを提供します。 |

# クラウド＆インフラセキュリティ・スキル

このスキルは、クラウドインフラ、CI/CDパイプライン、およびデプロイ構成がセキュリティのベストプラクティスに従い、業界標準に準拠していることを確認します。

## 有効化のタイミング

* クラウドプラットフォーム（AWS、Vercel、Railway、Cloudflareなど）へのアプリケーションデプロイ時
* IAMロールおよび権限の構成時
* CI/CDパイプラインのセットアップ時
* Infrastructure as Code（Terraform、CloudFormationなど）の実装時
* ロギングおよびモニタリングの構成時
* クラウド環境でのシークレット管理時
* CDNおよびエッジセキュリティの設定時
* 災害復旧（DR）およびバックアップ戦略の実装時

## クラウドセキュリティチェックリスト

### 1. IAMとアクセス制御

#### 最小権限の原則

```yaml
# ✅ 正解: 最小限の権限
iam_role:
  permissions:
    - s3:GetObject  # 読み取りアクセスのみ
    - s3:ListBucket
  resources:
    - arn:aws:s3:::my-bucket/* # 特定のバケットのみ

# ❌ 誤り: 広すぎる権限
iam_role:
  permissions:
    - s3:* # すべてのS3操作
  resources:
    - "*"  # すべてのリソース

```

#### 多要素認証 (MFA)

```bash
# ルート/管理者アカウントには必ずMFAを有効にする
aws iam enable-mfa-device \
  --user-name admin \
  --serial-number arn:aws:iam::123456789:mfa/admin \
  --authentication-code1 123456 \
  --authentication-code2 789012

```

#### 検証ステップ

* [ ] 本番環境でルートアカウントを使用していないか
* [ ] すべての特権アカウントでMFAが有効になっているか
* [ ] サービスアカウントが長期保存の認証情報ではなく、ロールを使用しているか
* [ ] IAMポリシーが最小権限の原則に従っているか
* [ ] 定期的なアクセスレビューが実施されているか
* [ ] 未使用の認証情報がローテーションまたは削除されているか

### 2. シークレット管理

#### クラウドシークレットマネージャー

```typescript
// ✅ 正解: クラウドのシークレットマネージャーを使用する
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'prod/api-key' });
const apiKey = JSON.parse(secret.SecretString).key;

// ❌ 誤り: ハードコード、または環境変数のみでの管理
const apiKey = process.env.API_KEY; // ローテーションや監査が困難

```

#### シークレットのローテーション

```bash
# データベース認証情報の自動ローテーションを設定する
aws secretsmanager rotate-secret \
  --secret-id prod/db-password \
  --rotation-lambda-arn arn:aws:lambda:region:account:function:rotate \
  --rotation-rules AutomaticallyAfterDays=30

```

#### 検証ステップ

* [ ] すべてのシークレットがクラウドシークレットマネージャー（AWS Secrets Manager、Vercel Secretsなど）に保存されているか
* [ ] データベース認証情報の自動ローテーションが有効か
* [ ] APIキーが少なくとも四半期ごとにローテーションされているか
* [ ] コード、ログ、エラーメッセージにシークレットが含まれていないか
* [ ] シークレットアクセスに対する監査ログが有効になっているか

### 3. ネットワークセキュリティ

#### VPCとファイアウォールの構成

```terraform
# ✅ 正解: 制限されたセキュリティグループ
resource "aws_security_group" "app" {
  name = "app-sg"
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # 内部VPCのみ
  }
  
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # HTTPSのアウトバウンドのみ
  }
}

# ❌ 誤り: インターネットに全開放
resource "aws_security_group" "bad" {
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # 全ポート、全IP！
  }
}

```

#### 検証ステップ

* [ ] データベースがパブリックアクセス可能になっていないか
* [ ] SSH/RDPポートがVPNまたは踏み台サーバーのみに制限されているか
* [ ] セキュリティグループが最小権限の原則に従っているか
* [ ] ネットワークACLが構成されているか
* [ ] VPCフローログが有効になっているか

### 4. ロギングとモニタリング

#### CloudWatch/ロギングの構成

```typescript
// ✅ 正解: 包括的なロギング
import { CloudWatchLogsClient, CreateLogStreamCommand } from '@aws-sdk/client-cloudwatch-logs';

const logSecurityEvent = async (event: SecurityEvent) => {
  await cloudwatch.putLogEvents({
    logGroupName: '/aws/security/events',
    logStreamName: 'authentication',
    logEvents: [{
      timestamp: Date.now(),
      message: JSON.stringify({
        type: event.type,
        userId: event.userId,
        ip: event.ip,
        result: event.result,
        // 機密データは決して記録しない
      })
    }]
  });
};

```

#### 検証ステップ

* [ ] すべてのサービスでCloudWatch/ロギングが有効になっているか
* [ ] 認証失敗の試行が記録されているか
* [ ] 管理者操作が監査されているか
* [ ] ログの保持期間が設定されているか（コンプライアンスのため90日以上）
* [ ] 不審なアクティビティに対するアラートが設定されているか
* [ ] ログが中央集約され、改ざん防止策が取られているか

### 5. CI/CDパイプラインのセキュリティ

#### 安全なパイプライン構成

```yaml
# ✅ 正解: 安全なGitHub Actionsワークフロー
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read  # 最小限の権限
      
    steps:
      - uses: actions/checkout@v4
      
      # シークレットスキャン
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
        
      # 依存関係の監査
      - name: Audit dependencies
        run: npm audit --audit-level=high
        
      # 長期トークンではなくOIDCを使用
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1

```

#### サプライチェーンセキュリティ

```json
// package.json - ロックファイルと整合性チェックを使用
{
  "scripts": {
    "install": "npm ci",  // 再現可能なビルドのためにciを使用
    "audit": "npm audit --audit-level=moderate",
    "check": "npm outdated"
  }
}

```

#### 検証ステップ

* [ ] 長期認証情報の代わりにOIDCが使用されているか
* [ ] パイプライン内でシークレットスキャンが行われているか
* [ ] 依存関係の脆弱性スキャンが行われているか
* [ ] コンテナイメージスキャンが行われているか（該当する場合）
* [ ] ブランチ保護ルールが強制されているか
* [ ] マージ前にコードレビューが必須となっているか
* [ ] 署名済みコミットが強制されているか

### 6. CloudflareとCDNセキュリティ

#### Cloudflareセキュリティ構成

```typescript
// ✅ 正解: セキュリティヘッダーを付与するCloudflare Workers
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request);
    
    // セキュリティヘッダーの追加
    const headers = new Headers(response.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};

```

#### WAFルール

```bash
# Cloudflare WAFマネージドルールの有効化
# - OWASPコアルールセット
# - Cloudflareマネージドルールセット
# - レート制限ルール
# - ボット保護

```

#### 検証ステップ

* [ ] WAFがOWASPルールと共に有効になっているか
* [ ] レート制限が構成されているか
* [ ] ボット保護が有効か
* [ ] DDoS保護が有効か
* [ ] セキュリティヘッダーが構成されているか
* [ ] SSL/TLSが「フル(厳格)」モードに設定されているか

### 7. バックアップと災害復旧 (DR)

#### 自動バックアップ

```terraform
# ✅ 正解: RDSの自動バックアップ
resource "aws_db_instance" "main" {
  allocated_storage     = 20
  engine               = "postgres"
  
  backup_retention_period = 30  # 30日間の保持
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  deletion_protection = true  # 誤削除防止
}

```

#### 検証ステップ

* [ ] 毎日の自動バックアップが構成されているか
* [ ] バックアップの保持期間がコンプライアンス要件を満たしているか
* [ ] ポイントインタイムリカバリ (PITR) が有効か
* [ ] バックアップの復元テストが四半期ごとに実施されているか
* [ ] 災害復旧計画が文書化されているか
* [ ] RPO（目標復旧時点）とRTO（目標復旧時間）が定義され、テストされているか

## デプロイ前クラウドセキュリティチェックリスト

本番環境へのデプロイ前に確認してください：

* [ ] **IAM**: ルートアカウントの未使用、MFA有効化、最小権限ポリシー
* [ ] **シークレット**: すべてのシークレットがクラウド管理サービスにあり、ローテーションが設定されているか
* [ ] **ネットワーク**: セキュリティグループが制限され、データベースが非公開か
* [ ] **ロギング**: 保持期間を設定したロギングが有効か
* [ ] **モニタリング**: 異常に対するアラートが構成されているか
* [ ] **CI/CD**: OIDC認証、シークレットスキャン、依存関係監査が実施されているか
* [ ] **CDN/WAF**: WAFが有効で適切なルールが適用されているか
* [ ] **暗号化**: 保存時および転送時のデータが暗号化されているか
* [ ] **バックアップ**: 自動バックアップと復元テストが完了しているか
* [ ] **ドキュメント**: インフラが文書化され、手順書（ランブック）が作成されているか
* [ ] **インシデント対応**: セキュリティインシデント対応計画が整備されているか

## よくあるクラウドセキュリティの誤設定

### S3バケットの公開

```bash
# ❌ 誤り: 公開バケット
aws s3api put-bucket-acl --bucket my-bucket --acl public-read

# ✅ 正解: 特定のアクセスのみを許可するプライベートバケット
aws s3api put-bucket-acl --bucket my-bucket --acl private
aws s3api put-bucket-policy --bucket my-bucket --policy file://policy.json

```

### RDSのパブリックアクセス

```terraform
# ❌ 誤り
resource "aws_db_instance" "bad" {
  publicly_accessible = true  # 絶対にしないでください！
}

# ✅ 正解
resource "aws_db_instance" "good" {
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.db.id]
}

```

---

**忘れないでください**: クラウドの誤設定はデータ漏洩の主な原因です。たった一つの公開されたS3バケットや、過度に許可されたIAMポリシーがインフラ全体を危険にさらす可能性があります。常に最小権限の原則と多層防御を実践してください。