$store = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "LocalMachine")
$store.Open("ReadOnly")
$cert = $store.Certificates | Where-Object { $_.Subject -like "*techloq*" }
if ($cert) {
    $base64 = [Convert]::ToBase64String($cert.RawData, [Base64FormattingOptions]::InsertLineBreaks)
    $pem = "-----BEGIN CERTIFICATE-----`n" + $base64 + "`n-----END CERTIFICATE-----`n"
    [IO.File]::WriteAllText("$PSScriptRoot\Project\src\certs\corporate-ca.crt", $pem)
    Write-Host "Done! Exported: $($cert.Subject)"
} else {
    Write-Host "techloq certificate not found!"
}
$store.Close()
