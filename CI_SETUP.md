# GitHub Actions CI/CD Setup for Power Pages

## Overview
This repository includes a GitHub Actions workflow that automatically deploys Power Pages changes when code is pushed to the main branch.

## Setup Instructions

### 1. GitHub Repository Secrets
You need to add the following secrets to your GitHub repository:

**Go to:** Repository Settings → Secrets and Variables → Actions → New Repository Secret

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `POWER_PLATFORM_ENVIRONMENT_URL` | `https://org601a79e1.crm.dynamics.com/` | Your Power Platform environment URL |
| `POWER_PLATFORM_USERNAME` | `etrifari@captechventures.com` | Your Power Platform username |
| `POWER_PLATFORM_PASSWORD` | `[Your Password]` | Your Power Platform password |

### 2. Workflow File
The workflow is defined in `.github/workflows/power-pages-ci.yml` and includes:

- **Trigger**: Runs on push to main branch and pull requests
- **Environment**: Windows runner (required for Power Platform CLI)
- **Steps**: 
  - Checkout code
  - Install Power Platform CLI
  - Authenticate to Power Platform
  - Upload Power Pages using the `upload-paportal@v1` action
  - Publish the site with `pac paportal publish`
  - Notify on success/failure

### 3. How It Works

1. **Developer pushes changes** to main branch
2. **GitHub Actions triggers** the workflow
3. **Workflow authenticates** to Power Platform
4. **Site content is uploaded and published** automatically
5. **Notifications** confirm success or failure

### 4. Security Best Practices

- ✅ Uses repository secrets for credentials
- ✅ Runs on secure GitHub-hosted runners
- ✅ Only triggers on main branch pushes
- ✅ Provides clear success/failure notifications

### 5. Monitoring

- View workflow runs in the **Actions** tab of your GitHub repository
- Check logs for detailed deployment information
- Monitor for any authentication or upload issues

### 6. Alternative Authentication (Service Principal)

For production environments, consider using Service Principal authentication:

```yaml
- name: Authenticate with Service Principal
  uses: microsoft/powerplatform-actions/who-am-i@v1
  with:
    environment-url: ${{ secrets.POWER_PLATFORM_ENVIRONMENT_URL }}
    app-id: ${{ secrets.POWER_PLATFORM_APP_ID }}
    client-secret: ${{ secrets.POWER_PLATFORM_CLIENT_SECRET }}
    tenant-id: ${{ secrets.POWER_PLATFORM_TENANT_ID }}
```

## Troubleshooting

### Common Issues:
1. **Authentication fails**: Check that secrets are correctly set
2. **Upload fails**: Verify file paths and permissions
3. **Workflow doesn't trigger**: Ensure changes are pushed to main branch

### Getting Help:
- Check the Actions tab for detailed logs
- Review Power Platform CLI documentation
- Verify environment permissions

---

*Last Updated: January 2025*
*Project: RCSA Power Pages Application* 