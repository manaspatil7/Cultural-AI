import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Dataset
from einops import rearrange, repeat
from einops.layers.torch import Rearrange
import torch.nn.functional as F

# Helper functions
def pair(t):
    return t if isinstance(t, tuple) else (t, t)

# ViT Model
class ViT(nn.Module):
    def __init__(self, *, image_size, patch_size, num_classes, dim, depth, heads, mlp_dim, channels=3, dim_head=64):
        super().__init__()
        image_height, image_width = pair(image_size)
        patch_height, patch_width = pair(patch_size)

        assert image_height % patch_height == 0 and image_width % patch_width == 0, 'Image dimensions must be divisible by the patch size.'

        num_patches = (image_height // patch_height) * (image_width // patch_width)
        patch_dim = channels * patch_height * patch_width

        self.to_patch_embedding = nn.Sequential(
            Rearrange('b c (h p1) (w p2) -> b (h w) (p1 p2 c)', p1=patch_height, p2=patch_width),
            nn.LayerNorm(patch_dim),
            nn.Linear(patch_dim, dim),
            nn.LayerNorm(dim),
        )

        self.pos_embedding = nn.Parameter(torch.randn(1, num_patches + 1, dim))
        self.cls_token = nn.Parameter(torch.randn(1, 1, dim))
        self.dropout = nn.Dropout(0.1)

        self.transformer = nn.TransformerEncoder(
            encoder_layer=nn.TransformerEncoderLayer(
                d_model=dim,
                nhead=heads,
                dim_feedforward=mlp_dim,
                dropout=0.1,
                activation='gelu'
            ),
            num_layers=depth
        )

        self.mlp_head = nn.Sequential(
            nn.LayerNorm(dim),
            nn.Linear(dim, num_classes)
        )

    def forward(self, img):
        x = self.to_patch_embedding(img)
        b, n, _ = x.shape

        cls_tokens = repeat(self.cls_token, '1 1 d -> b 1 d', b=b)
        x = torch.cat((cls_tokens, x), dim=1)
        x += self.pos_embedding[:, :(n + 1)]
        x = self.dropout(x)

        x = rearrange(x, 'b n d -> n b d')  # transformer expects seq_len first
        x = self.transformer(x)
        x = rearrange(x, 'n b d -> b n d')

        cls_token_final = x[:, 0]
        return self.mlp_head(cls_token_final)

# Configuration
class ViTConfig:
    image_size = 224
    patch_size = 16
    num_classes = 1000
    channels = 3
    dim = 768
    depth = 12
    heads = 12
    mlp_dim = 3072
    dim_head = 64

# Model Initialization
model = ViT(
    image_size=ViTConfig.image_size,
    patch_size=ViTConfig.patch_size,
    num_classes=ViTConfig.num_classes,
    dim=ViTConfig.dim,
    depth=ViTConfig.depth,
    heads=ViTConfig.heads,
    mlp_dim=ViTConfig.mlp_dim,
    dim_head=ViTConfig.dim_head
)

# Dummy Data Test
def test_compilation():
    dummy_img = torch.randn(1, 3, 224, 224)
    output = model(dummy_img)
    print(f"Output shape: {output.shape}")  # Should be (1, 1000)

# Data Loading (Placeholder)
class CulturalDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.transform = transform
        # Add actual dataset loading logic here
    
    def __len__(self):
        return 100  # Dummy length
    
    def __getitem__(self, idx):
        sample = torch.randn(3, 224, 224)  # Dummy data
        return sample, 0  # Dummy label

# Training Setup (Placeholder)
def main():
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    train_dataset = CulturalDataset(
        root_dir="path/to/data",
        transform=transform
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=32,
        shuffle=True
    )

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    # Training loop (placeholder)
    for epoch in range(10):
        for batch_idx, (data, targets) in enumerate(train_loader):
            outputs = model(data)
            loss = criterion(outputs, targets)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            if batch_idx % 10 == 0:
                print(f"Epoch: {epoch}, Batch: {batch_idx}, Loss: {loss.item()}")

if __name__ == "__main__":
    test_compilation()
    # main()  # Uncomment to test full pipeline (needs data)