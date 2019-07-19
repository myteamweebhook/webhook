Param(

    [Parameter(Mandatory = $true, Position = 1)]
    [string]$SiteAlias,

    [Parameter(Mandatory = $true, Position = 2)]
    [string]$ItemID
)  

$usr = "admin@inparlabsdev.onmicrosoft.com"
$pwd = "123@mudar"
Write-Host 'Alive'
exit

$encPwd = ConvertTo-SecureString -String $pwd -AsPlainText -force
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $usr,$encPwd

$TenantName = 'inparlabsdev'
$logList = "Lista de Criacao"
$logListSite = "https://$TenantName.sharepoint.com/sites/testekadu"
$siteUrl = "https://$TenantName.sharepoint.com/sites/$SiteAlias"

Write-Output 'Connecting to Site..'
$Connection = Connect-PnPOnline -Url $siteUrl -Credential $Credential

try{
    # Provision Template
    Write-Output 'Provisioning Site Template..'
    Apply-PnPProvisioningTemplate -Path .\modeloFirjan.xml -ClearNavigation -Connection $Connection
}
catch{
    Write-Output 'Error provisioning template' 
}

$listConnection = Connect-PnPOnline -Url $logListSite -Credential $Credential
Set-PnPListItem -List $logList -Identity $ItemID -Values @{"Pronto" = $true} -Connection $listConnection

Disconnect-PnPOnline
Write-Output "Done"